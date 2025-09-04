// Client-side API implementation - now uses HTTP requests to backend API
// Use relative URL - Vite will proxy /api requests to localhost:3001
const API_BASE_URL = '/api';

export interface CardData {
  name: string
  position?: string
  company?: string
  email?: string
  phone?: string
  whatsapp?: string
  address?: string
  website?: string
  linkedin?: string
  instagram?: string
  bio?: string
  avatar?: string
  companyLogo?: string
}

// Helper function for API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    console.log(`Making API request to: ${url}`);
    console.log('Request config:', config);
    
    const response = await fetch(url, config);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error text:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    console.error('Full error object:', error);
    throw error;
  }
}

// Card API functions
export async function createCard(data: CardData, employeeId?: string): Promise<any> {
  try {
    return await apiRequest('/cards', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('Failed to create card:', error);
    throw error;
  }
}

export async function getCard(id: string): Promise<any | null> {
  try {
    return await apiRequest(`/cards/${id}`);
  } catch (error) {
    console.error('Failed to get card:', error);
    return null;
  }
}

export async function updateCard(id: string, data: Partial<CardData>): Promise<any> {
  try {
    return await apiRequest(`/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('Failed to update card:', error);
    throw error;
  }
}

export async function deleteCard(id: string): Promise<void> {
  try {
    await apiRequest(`/cards/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Failed to delete card:', error);
    throw error;
  }
}

export async function getUserCards(): Promise<any[]> {
  try {
    return await apiRequest('/cards');
  } catch (error) {
    console.error('Failed to get user cards:', error);
    return [];
  }
}

// Employee management
export interface EmployeeData {
  name: string
  position: string
  email: string
  phone: string
  department?: string
  status?: 'Aktiv' | 'Inaktiv'
  avatar?: string
}

export async function createEmployee(data: EmployeeData): Promise<any> {
  try {
    console.log('Creating employee with data:', data);
    console.log('API request to:', `${API_BASE_URL}/employees`);
    
    const result = await apiRequest('/employees', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    console.log('Employee created successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to create employee:', error);
    console.error('Error details:', error.message, error.stack);
    throw error;
  }
}

export async function getEmployee(id: string): Promise<any | null> {
  try {
    return await apiRequest(`/employees/${id}`);
  } catch (error) {
    console.error('Failed to get employee:', error);
    return null;
  }
}

export async function updateEmployee(id: string, data: Partial<EmployeeData & { hasCard?: boolean }>): Promise<any> {
  try {
    return await apiRequest(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('Failed to update employee:', error);
    throw error;
  }
}

export async function deleteEmployee(id: string): Promise<void> {
  try {
    await apiRequest(`/employees/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Failed to delete employee:', error);
    throw error;
  }
}

export async function getAllEmployees(): Promise<any[]> {
  try {
    return await apiRequest('/employees');
  } catch (error) {
    console.error('Failed to get employees:', error);
    return [];
  }
}

export async function createEmployeeCard(employeeId: string, cardData: CardData): Promise<any> {
  try {
    // Create a card for the employee
    const card = await createCard(cardData);
    
    // Update employee to mark they have a card
    if (card) {
      await updateEmployee(employeeId, { hasCard: true });
    }
    
    return card;
  } catch (error) {
    console.error('Failed to create employee card:', error);
    throw error;
  }
}

// Settings management
export interface SettingsData {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  borderRadius: string;
  companyName: string;
  companyLogo: string;
  defaultAddress: string;
  defaultWebsite: string;
}

export async function getSettings(): Promise<SettingsData | null> {
  try {
    return await apiRequest('/settings');
  } catch (error) {
    console.error('Failed to get settings:', error);
    return null;
  }
}

export async function saveSettings(settings: SettingsData): Promise<void> {
  try {
    await apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
}

export async function resetSettings(): Promise<void> {
  try {
    const defaultSettings = {
      primaryColor: '#1e40af',
      secondaryColor: '#f8fafc',
      textColor: '#1f2937',
      backgroundColor: '#ffffff',
      borderRadius: '8',
      companyName: 'Stadtwerke Geesthacht',
      companyLogo: '',
      defaultAddress: 'Stadtwerke Geesthacht, Geesthacht',
      defaultWebsite: 'www.stadtwerke-geesthacht.de'
    };
    
    await apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(defaultSettings)
    });
  } catch (error) {
    console.error('Failed to reset settings:', error);
    throw error;
  }
}

// QR Code management
export async function createQRCode(cardId: string, name: string, url: string, qrData: string): Promise<any> {
  try {
    return await apiRequest('/qrcodes', {
      method: 'POST',
      body: JSON.stringify({ cardId, name, url, qrData })
    });
  } catch (error) {
    console.error('Failed to create QR code:', error);
    throw error;
  }
}

export async function getCardQRCodes(cardId: string): Promise<any[]> {
  try {
    return await apiRequest(`/cards/${cardId}/qrcodes`);
  } catch (error) {
    console.error('Failed to get QR codes:', error);
    return [];
  }
}

export async function deleteQRCode(id: string): Promise<void> {
  try {
    await apiRequest(`/qrcodes/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Failed to delete QR code:', error);
    throw error;
  }
}