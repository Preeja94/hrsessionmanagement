import React, { createContext, useState, useContext, useEffect } from 'react';

const SessionRequestContext = createContext();

// Load from localStorage
const loadSessionRequests = () => {
  try {
    const saved = localStorage.getItem('sessionRequests');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading session requests from localStorage:', error);
  }
  
  // Default data
  return [
    {
      id: 1,
      employeeName: "John Smith",
      sessionName: "Mental Health & Wellbeing",
      attemptsUsed: 3,
      maxAttempts: 3,
      lockedDate: "Dec 16, 2024",
      status: "locked",
      reason: "I was having technical difficulties during my quiz attempts and couldn't complete properly. I would appreciate another chance to demonstrate my understanding of the material.",
      employeeEmail: "john.smith@company.com"
    },
    {
      id: 2,
      employeeName: "Lisa Wilson",
      sessionName: "Leadership Development",
      attemptsUsed: 5,
      maxAttempts: 5,
      lockedDate: "Dec 15, 2024",
      status: "locked",
      reason: "I need additional study time and would benefit from one more attempt to pass this important leadership training.",
      employeeEmail: "lisa.wilson@company.com"
    },
    {
      id: 3,
      employeeName: "Mike Johnson",
      sessionName: "React Development Fundamentals",
      attemptsUsed: 2,
      maxAttempts: 3,
      lockedDate: "Dec 17, 2024",
      status: "pending",
      reason: "I missed the original session due to a family emergency and would like to request access to complete this important training.",
      employeeEmail: "mike.johnson@company.com"
    },
    {
      id: 4,
      employeeName: "Sarah Davis",
      sessionName: "Cybersecurity Fundamentals",
      attemptsUsed: 4,
      maxAttempts: 5,
      lockedDate: "Dec 14, 2024",
      status: "pending",
      reason: "I was having internet connectivity issues during my attempts and couldn't complete the assessment properly. Please allow me one more attempt.",
      employeeEmail: "sarah.davis@company.com"
    }
  ];
};

export const SessionRequestProvider = ({ children }) => {
  const [sessionRequests, setSessionRequests] = useState(loadSessionRequests);
  
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

  console.log('SessionRequestProvider initialized with:', sessionRequests.length, 'requests');

  // Save to localStorage whenever sessionRequests changes
  useEffect(() => {
    try {
      localStorage.setItem('sessionRequests', JSON.stringify(sessionRequests));
      console.log('Saved session requests to localStorage:', sessionRequests);
    } catch (error) {
      console.error('Error saving session requests to localStorage:', error);
    }
  }, [sessionRequests]);

  // Listen for storage changes (cross-tab communication)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sessionRequests' && e.newValue) {
        try {
          const newRequests = JSON.parse(e.newValue);
          setSessionRequests(newRequests);
          console.log('Received session requests update from another tab:', newRequests);
        } catch (error) {
          console.error('Error parsing session requests from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addSessionRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      status: request.status || 'pending'
    };
    console.log('Adding new session request:', newRequest);
    setSessionRequests(prev => [newRequest, ...prev]);
  };

  const updateRequestStatus = (requestId, newStatus, extra = {}) => {
    setSessionRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: newStatus, ...extra } : req
      )
    );
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
      employeePerformance,
      addSessionRequest, 
      updateRequestStatus,
      updateEmployeePerformance,
      getAnalyticsData
    }}>
      {children}
    </SessionRequestContext.Provider>
  );
};

export const useSessionRequests = () => {
  return useContext(SessionRequestContext);
};
