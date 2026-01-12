import React, { createContext, useState, useContext, useEffect } from 'react';
import { sessionRequestAPI, analyticsAPI } from '../utils/api';

const SessionRequestContext = createContext();

export const SessionRequestProvider = ({ children }) => {
  const [sessionRequests, setSessionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load session requests from API
  useEffect(() => {
    const loadSessionRequests = async () => {
      try {
        setLoading(true);
        const requests = await sessionRequestAPI.getAll();
        // Transform API data to match expected format
        const transformed = requests.map(req => ({
          id: req.id,
          employeeName: req.employee_name || '',
          sessionName: req.session_name || '',
          attemptsUsed: req.attempts_used || 0,
          maxAttempts: req.max_attempts || 3,
          lockedDate: req.locked_date ? new Date(req.locked_date).toLocaleDateString() : null,
          requestDate: req.created_at ? new Date(req.created_at).toLocaleString() : null,
          createdAt: req.created_at || null,
          status: req.status || 'pending',
          reason: req.reason || '',
          employeeEmail: req.employee_email || '',
          employee: req.employee,
          session: req.session
        }));
        setSessionRequests(transformed);
      } catch (error) {
        console.error('Error loading session requests from API:', error);
        setSessionRequests([]);
      } finally {
        setLoading(false);
      }
    };
    loadSessionRequests();
  }, []);
  
  // Employee performance tracking - loaded from API
  const [employeePerformance, setEmployeePerformance] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  
  // Analytics data state
  const [analyticsCache, setAnalyticsCache] = useState({
    totalLearners: 0,
    completionRate: 0,
    averageRating: 0,
    activeSessions: 0,
    totalSessionsCompleted: 0,
    topPerformers: []
  });
  
  // Load analytics data from API
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setAnalyticsLoading(true);
        const analyticsData = await analyticsAPI.getAnalytics();
        if (analyticsData) {
          if (analyticsData.employeePerformance) {
            setEmployeePerformance(analyticsData.employeePerformance);
          }
          // Update analytics cache
          setAnalyticsCache({
            totalLearners: analyticsData.totalLearners || 0,
            completionRate: analyticsData.completionRate || 0,
            averageRating: analyticsData.averageRating || 0,
            activeSessions: analyticsData.activeSessions || 0,
            totalSessionsCompleted: analyticsData.totalSessionsCompleted || 0,
            topPerformers: analyticsData.topPerformers || []
          });
        }
      } catch (error) {
        console.error('Error loading analytics from API:', error);
        setEmployeePerformance([]);
        // Fallback to empty cache
        setAnalyticsCache({
          totalLearners: 0,
          completionRate: 0,
          averageRating: 0,
          activeSessions: sessionRequests.filter(req => req.status === 'pending' || req.status === 'locked').length,
          totalSessionsCompleted: 0,
          topPerformers: []
        });
      } finally {
        setAnalyticsLoading(false);
      }
    };
    loadAnalytics();
    // Refresh analytics every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const addSessionRequest = async (request) => {
    try {
      const newRequest = await sessionRequestAPI.create({
        employee: request.employee,
        session: request.session,
        reason: request.reason || '',
        status: request.status || 'pending',
        attempts_used: request.attemptsUsed || 0,
        max_attempts: request.maxAttempts || 3
      });
      
      // Transform and add to local state
      const transformed = {
        id: newRequest.id,
        employeeName: newRequest.employee_name || '',
        sessionName: newRequest.session_name || '',
        attemptsUsed: newRequest.attempts_used || 0,
        maxAttempts: newRequest.max_attempts || 3,
        lockedDate: newRequest.locked_date ? new Date(newRequest.locked_date).toLocaleDateString() : null,
        requestDate: newRequest.created_at ? new Date(newRequest.created_at).toLocaleString() : null,
        createdAt: newRequest.created_at || null,
        status: newRequest.status || 'pending',
        reason: newRequest.reason || '',
        employeeEmail: newRequest.employee_email || '',
        employee: newRequest.employee,
        session: newRequest.session
      };
      setSessionRequests(prev => [transformed, ...prev]);
    } catch (error) {
      console.error('Error adding session request:', error);
      throw error;
    }
  };

  const updateRequestStatus = async (requestId, newStatus, extra = {}) => {
    try {
      const request = sessionRequests.find(req => req.id === requestId);
      if (!request) return;
      
      const updated = await sessionRequestAPI.update(requestId, {
        status: newStatus,
        ...extra
      });
      
      // Update local state
      setSessionRequests(prev =>
        prev.map(req =>
          req.id === requestId ? {
            ...req,
            status: newStatus,
            ...extra,
            lockedDate: updated.locked_date ? new Date(updated.locked_date).toLocaleDateString() : req.lockedDate
          } : req
        )
      );
    } catch (error) {
      console.error('Error updating session request:', error);
      throw error;
    }
  };

  // Update employee performance when they complete sessions
  const updateEmployeePerformance = (employeeId, sessionCompleted = false, rating = null) => {
    setEmployeePerformance(prev =>
      prev.map(emp => {
        if (emp.id === employeeId) {
          const newSessionsCompleted = sessionCompleted ? emp.sessionsCompleted + 1 : emp.sessionsCompleted;
          const newCompletionRate = Math.round((newSessionsCompleted / emp.totalSessions) * 100);
          const newAverageRating = rating ? 
            ((emp.averageRating * emp.sessionsCompleted) + rating) / (emp.sessionsCompleted + 1) : 
            emp.averageRating;
          
          return {
            ...emp,
            sessionsCompleted: newSessionsCompleted,
            completionRate: newCompletionRate,
            averageRating: Math.round(newAverageRating * 10) / 10,
            lastActivity: new Date().toISOString().split('T')[0]
          };
        }
        return emp;
      })
    );
  };


  // Calculate real-time analytics - use cached data
  const getAnalyticsData = () => {
    return analyticsCache;
  };

  return (
    <SessionRequestContext.Provider value={{ 
      sessionRequests, 
      loading,
      employeePerformance,
      addSessionRequest, 
      updateRequestStatus,
      updateEmployeePerformance,
      getAnalyticsData,
      refreshRequests: async () => {
        try {
          const requests = await sessionRequestAPI.getAll();
          const transformed = requests.map(req => ({
            id: req.id,
            employeeName: req.employee_name || '',
            sessionName: req.session_name || '',
            attemptsUsed: req.attempts_used || 0,
            maxAttempts: req.max_attempts || 3,
            lockedDate: req.locked_date ? new Date(req.locked_date).toLocaleDateString() : null,
            requestDate: req.created_at ? new Date(req.created_at).toLocaleString() : null,
            createdAt: req.created_at || null,
            status: req.status || 'pending',
            reason: req.reason || '',
            employeeEmail: req.employee_email || '',
            employee: req.employee,
            session: req.session
          }));
          setSessionRequests(transformed);
        } catch (error) {
          console.error('Error refreshing session requests:', error);
        }
      }
    }}>
      {children}
    </SessionRequestContext.Provider>
  );
};

export const useSessionRequests = () => {
  return useContext(SessionRequestContext);
};
