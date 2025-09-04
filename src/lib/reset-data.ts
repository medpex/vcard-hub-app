// Database reset functions - no localStorage usage
import { db } from './db'

// Function to clear all stored data from database
export async function clearAllData(userId: string = 'temp-user') {
  try {
    // Delete all user's cards (this will cascade to delete QR codes)
    await db.card.deleteMany({
      where: { userId }
    })
    
    // Delete all user's employees
    await db.employee.deleteMany({
      where: { userId }
    })
    
    // Reset settings to default
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
    
    console.log('All application data cleared from database')
  } catch (error) {
    console.error('Failed to clear data from database:', error)
    throw error
  }
}

// Function to completely reset all data in database
export async function resetEverything() {
  try {
    // Clear data for the default user
    await clearAllData('temp-user')
    
    console.log('Completely reset all vCard data in database')
    
    // Force page reload to ensure clean state
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  } catch (error) {
    console.error('Failed to reset database:', error)
    throw error
  }
}

// Quick reset function for testing
export async function quickReset() {
  try {
    await resetEverything()
  } catch (error) {
    console.error('Quick reset failed:', error)
    throw error
  }
}

// Function to check if there is any data in database
export async function hasAnyData(userId: string = 'temp-user'): Promise<boolean> {
  try {
    const cardCount = await db.card.count({
      where: { userId }
    })
    
    const employeeCount = await db.employee.count({
      where: { userId }
    })
    
    return cardCount > 0 || employeeCount > 0
  } catch (error) {
    console.error('Failed to check for data:', error)
    return false
  }
}

// Function to get data statistics
export async function getDataStats(userId: string = 'temp-user') {
  try {
    const [cardCount, employeeCount, qrCodeCount, settings] = await Promise.all([
      db.card.count({ where: { userId } }),
      db.employee.count({ where: { userId } }),
      db.qRCode.count({ 
        where: { card: { userId } }
      }),
      db.settings.findUnique({ where: { userId } })
    ])
    
    return {
      cards: cardCount,
      employees: employeeCount,
      qrCodes: qrCodeCount,
      hasSettings: !!settings
    }
  } catch (error) {
    console.error('Failed to get data stats:', error)
    return {
      cards: 0,
      employees: 0,
      qrCodes: 0,
      hasSettings: false
    }
  }
}