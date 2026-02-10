import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ServerProfile } from '../types';
import { StorageService } from '../services/StorageService';

interface ServerContextType {
  servers: ServerProfile[];
  addServer: (server: ServerProfile) => Promise<void>;
  updateServer: (id: string, updates: Partial<ServerProfile>) => Promise<void>;
  deleteServer: (id: string) => Promise<void>;
  getServer: (id: string) => ServerProfile | undefined;
  loading: boolean;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export function ServerProvider({ children }: { children: ReactNode }) {
  const [servers, setServers] = useState<ServerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      const loadedServers = await StorageService.getServers();
      setServers(loadedServers);
    } catch (error) {
      console.error('Failed to load servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addServer = async (server: ServerProfile) => {
    const updated = [...servers, server];
    setServers(updated);
    await StorageService.saveServers(updated);
  };

  const updateServer = async (id: string, updates: Partial<ServerProfile>) => {
    const updated = servers.map(s => 
      s.id === id ? { ...s, ...updates } : s
    );
    setServers(updated);
    await StorageService.saveServers(updated);
  };

  const deleteServer = async (id: string) => {
    const updated = servers.filter(s => s.id !== id);
    setServers(updated);
    await StorageService.saveServers(updated);
    // Also delete credentials
    await StorageService.deleteCredentials(id);
  };

  const getServer = (id: string) => {
    return servers.find(s => s.id === id);
  };

  return (
    <ServerContext.Provider value={{
      servers,
      addServer,
      updateServer,
      deleteServer,
      getServer,
      loading,
    }}>
      {children}
    </ServerContext.Provider>
  );
}

export function useServers() {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error('useServers must be used within ServerProvider');
  }
  return context;
}