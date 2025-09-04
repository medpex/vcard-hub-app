import { db } from './db'

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

// Create a new card (temporary user until we implement authentication)
export async function createCard(data: CardData, userId: string = 'temp-user') {
  // Create user if not exists
  let user = await db.user.findUnique({
    where: { id: userId }
  })
  
  if (!user) {
    user = await db.user.create({
      data: {
        id: userId,
        email: `temp-${userId}@example.com`,
        name: 'Temporary User'
      }
    })
  }

  const card = await db.card.create({
    data: {
      ...data,
      userId,
      isPublic: true,
      slug: `card-${Date.now()}`
    }
  })

  return card
}

// Get card by ID
export async function getCard(id: string) {
  const card = await db.card.findUnique({
    where: { id },
    include: {
      user: true,
      qrCodes: true
    }
  })
  
  if (card) {
    // Increment view count
    await db.card.update({
      where: { id },
      data: { views: card.views + 1 }
    })
  }
  
  return card
}

// Get card by slug
export async function getCardBySlug(slug: string) {
  const card = await db.card.findUnique({
    where: { slug },
    include: {
      user: true,
      qrCodes: true
    }
  })
  
  if (card) {
    // Increment view count
    await db.card.update({
      where: { id: card.id },
      data: { views: card.views + 1 }
    })
  }
  
  return card
}

// Update card
export async function updateCard(id: string, data: Partial<CardData>) {
  return await db.card.update({
    where: { id },
    data
  })
}

// Delete card
export async function deleteCard(id: string) {
  return await db.card.delete({
    where: { id }
  })
}

// Get all cards for a user
export async function getUserCards(userId: string) {
  return await db.card.findMany({
    where: { userId },
    include: {
      qrCodes: true
    },
    orderBy: { updatedAt: 'desc' }
  })
}

// Create QR code for card
export async function createQRCode(cardId: string, name: string, url: string, qrData: string) {
  return await db.qRCode.create({
    data: {
      name,
      url,
      qrData,
      cardId
    }
  })
}

// Get QR codes for a card
export async function getCardQRCodes(cardId: string) {
  return await db.qRCode.findMany({
    where: { cardId },
    orderBy: { createdAt: 'desc' }
  })
}

// Delete QR Code
export async function deleteQRCode(id: string) {
  return await db.qRCode.delete({
    where: { id }
  })
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

export async function createEmployee(data: EmployeeData, userId: string = 'temp-user') {
  // Create user if not exists
  let user = await db.user.findUnique({
    where: { id: userId }
  })
  
  if (!user) {
    user = await db.user.create({
      data: {
        id: userId,
        email: `temp-${userId}@example.com`,
        name: 'Temporary User'
      }
    })
  }

  return await db.employee.create({
    data: {
      ...data,
      userId,
      status: data.status || 'Aktiv'
    }
  })
}

export async function getEmployee(id: string) {
  return await db.employee.findUnique({
    where: { id }
  })
}

export async function updateEmployee(id: string, data: Partial<EmployeeData & { hasCard?: boolean }>) {
  return await db.employee.update({
    where: { id },
    data
  })
}

export async function deleteEmployee(id: string) {
  return await db.employee.delete({
    where: { id }
  })
}

export async function getAllEmployees(userId: string = 'temp-user') {
  return await db.employee.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' }
  })
}

export async function createEmployeeCard(employeeId: string, cardData: CardData, userId: string = 'temp-user') {
  // Create a card for the employee
  const card = await createCard(cardData, userId)
  
  // Update employee to mark they have a card
  const employee = await getEmployee(employeeId)
  if (employee) {
    await updateEmployee(employeeId, { hasCard: true })
  }
  
  return card
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

export async function getSettings(userId: string = 'temp-user'): Promise<SettingsData | null> {
  // Create user if not exists
  let user = await db.user.findUnique({
    where: { id: userId },
    include: { settings: true }
  })
  
  if (!user) {
    user = await db.user.create({
      data: {
        id: userId,
        email: `temp-${userId}@example.com`,
        name: 'Temporary User'
      },
      include: { settings: true }
    })
  }

  if (!user.settings) {
    // Create default settings if none exist
    const defaultSettings = await db.settings.create({
      data: {
        userId,
        primaryColor: '#1e40af',
        secondaryColor: '#f8fafc',
        textColor: '#1f2937',
        backgroundColor: '#ffffff',
        borderRadius: '8',
        companyName: 'Stadtwerke Geesthacht',
        companyLogo: '',
        defaultAddress: 'Stadtwerke Geesthacht, Geesthacht',
        defaultWebsite: 'www.stadtwerke-geesthacht.de'
      }
    })
    return defaultSettings
  }

  return user.settings
}

export async function saveSettings(settings: SettingsData, userId: string = 'temp-user'): Promise<void> {
  // Check if settings exist
  const existingSettings = await db.settings.findUnique({
    where: { userId }
  })

  if (existingSettings) {
    // Update existing settings
    await db.settings.update({
      where: { userId },
      data: settings
    })
  } else {
    // Create new settings
    await db.settings.create({
      data: {
        ...settings,
        userId
      }
    })
  }
}

export async function resetSettings(userId: string = 'temp-user'): Promise<void> {
  await db.settings.upsert({
    where: { userId },
    update: {
      primaryColor: '#1e40af',
      secondaryColor: '#f8fafc',
      textColor: '#1f2937',
      backgroundColor: '#ffffff',
      borderRadius: '8',
      companyName: 'Stadtwerke Geesthacht',
      companyLogo: '',
      defaultAddress: 'Stadtwerke Geesthacht, Geesthacht',
      defaultWebsite: 'www.stadtwerke-geesthacht.de'
    },
    create: {
      userId,
      primaryColor: '#1e40af',
      secondaryColor: '#f8fafc',
      textColor: '#1f2937',
      backgroundColor: '#ffffff',
      borderRadius: '8',
      companyName: 'Stadtwerke Geesthacht',
      companyLogo: '',
      defaultAddress: 'Stadtwerke Geesthacht, Geesthacht',
      defaultWebsite: 'www.stadtwerke-geesthacht.de'
    }
  })
}