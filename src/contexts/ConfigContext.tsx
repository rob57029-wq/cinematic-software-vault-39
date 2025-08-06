
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Config {
  site_name: string;
  download_url: string;
  archive_password: string;
}

const defaultConfig: Config = {
  site_name: "CreationsTools",
  download_url: "https://creations.tools/creations-tools.zip",
  archive_password: "Soft2025"
};

interface ConfigContextType {
  config: Config;
  isLoading: boolean;
  error: Error | null;
}

const ConfigContext = createContext<ConfigContextType>({
  config: defaultConfig,
  isLoading: true,
  error: null
});

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/config.json');
        if (!response.ok) {
          throw new Error('Failed to load configuration');
        }
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        console.error('Error loading config:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, isLoading, error }}>
      {children}
    </ConfigContext.Provider>
  );
};
