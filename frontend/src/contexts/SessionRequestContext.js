import React, { createContext, useState, useContext, useEffect } from 'react';
import { sessionRequestAPI } from '../utils/api';

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
  
  // Employee performance tracking
  const [employeePerformance, setEmployeePerformance] = useState([
    {
      id: 1,
      name: 'Sarah Thompson',
      department: 'Sales Department',
      sessionsCompleted: 12,
      totalSessions: 15,
      completionRate: 80,
      averageRating: 4.8,
      lastActivity: '2024-12-17',
      status: 'active'
    },
    {
      id: 2,
      name: 'Michael Chen',
      department: 'Engineering Department',
      sessionsCompleted: 15,
      totalSessions: 18,
      completionRate: 83,
      averageRating: 4.6,
      lastActivity: '2024-12-16',
      status: 'active'
    },
    {
      id: 3,
      name: 'Emily Davis',
      department: 'Marketing Department',
      sessionsCompleted: 10,
      totalSessions: 12,
      completionRate: 83,
      averageRating: 4.7,
      lastActivity: '2024-12-15',
      status: 'active'
    },
    {
      id: 4,
      name: 'John Smith',
      department: 'HR Department',
      sessionsCompleted: 8,
      totalSessions: 10,
      completionRate: 80,
      averageRating: 4.5,
      lastActivity: '2024-12-14',
      status: 'active'
    },
    {
      id: 5,
      name: 'Lisa Wilson',
      department: 'Finance Department',
      sessionsCompleted: 14,
      totalSessions: 16,
      completionRate: 88,
      averageRating: 4.9,
      lastActivity: '2024-12-17',
      status: 'active'
    }
  ]);

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

  // Calculate real-time analytics
  const getAnalyticsData = () => {
    const totalLearners = employeePerformance.length;
    const totalSessionsCompleted = employeePerformance.reduce((sum, emp) => sum + emp.sessionsCompleted, 0);
    const totalSessions = employeePerformance.reduce((sum, emp) => sum + emp.totalSessions, 0);
    const averageCompletionRate = totalSessions > 0 ? Math.round((totalSessionsCompleted / totalSessions) * 100) : 0;
    const averageRating = employeePerformance.length > 0 ? 
      Math.round((employeePerformance.reduce((sum, emp) => sum + emp.averageRating, 0) / employeePerformance.length) * 10) / 10 : 0;
    const activeSessions = sessionRequests.filter(req => req.status === 'pending' || req.status === 'locked').length;

    return {
      totalLearners,
      completionRate: averageCompletionRate,
      averageRating,
      activeSessions,
      totalSessionsCompleted,
      topPerformers: employeePerformance
        .sort((a, b) => b.completionRate - a.completionRate)
        .slice(0, 3)
    };
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
