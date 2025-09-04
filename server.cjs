const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const port = 3001;

app.use(cors());
app.use(express.json());

// Default user ID for this demo
const DEFAULT_USER_ID = 'temp-user';

// Helper function to ensure user exists
async function ensureUser(userId = DEFAULT_USER_ID) {
  let user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: userId,
        email: `temp-${userId}@example.com`,
        name: 'Temporary User'
      }
    });
  }
  
  return user;
}

// Card endpoints
app.get('/api/cards', async (req, res) => {
  try {
    await ensureUser();
    const cards = await prisma.card.findMany({
      where: { userId: DEFAULT_USER_ID },
      include: { qrCodes: true },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

app.post('/api/cards', async (req, res) => {
  try {
    await ensureUser();
    const card = await prisma.card.create({
      data: {
        ...req.body,
        userId: DEFAULT_USER_ID,
        isPublic: true,
        slug: `card-${Date.now()}`
      }
    });
    res.json(card);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ error: 'Failed to create card' });
  }
});

app.get('/api/cards/:id', async (req, res) => {
  try {
    const card = await prisma.card.findUnique({
      where: { id: req.params.id },
      include: { qrCodes: true }
    });
    
    if (card) {
      // Increment view count
      await prisma.card.update({
        where: { id: req.params.id },
        data: { views: card.views + 1 }
      });
    }
    
    res.json(card);
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ error: 'Failed to fetch card' });
  }
});

app.put('/api/cards/:id', async (req, res) => {
  try {
    const card = await prisma.card.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(card);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

app.delete('/api/cards/:id', async (req, res) => {
  try {
    await prisma.card.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

// Employee endpoints
app.get('/api/employees', async (req, res) => {
  try {
    await ensureUser();
    const employees = await prisma.employee.findMany({
      where: { userId: DEFAULT_USER_ID },
      include: {
        card: true
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.post('/api/employees', async (req, res) => {
  console.log('POST /api/employees - Request received');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  try {
    await ensureUser();
    console.log('User ensured, creating employee...');
    
    const employee = await prisma.employee.create({
      data: {
        ...req.body,
        userId: DEFAULT_USER_ID,
        status: req.body.status || 'Aktiv'
      }
    });
    
    console.log('Employee created successfully:', employee);
    res.json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to create employee', details: error.message });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.params.id },
      include: {
        card: true
      }
    });
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const employee = await prisma.employee.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    await prisma.employee.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Settings endpoints
app.get('/api/settings', async (req, res) => {
  try {
    const user = await ensureUser();
    let settings = await prisma.settings.findUnique({
      where: { userId: DEFAULT_USER_ID }
    });

    if (!settings) {
      // Create default settings
      settings = await prisma.settings.create({
        data: {
          userId: DEFAULT_USER_ID,
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
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    await ensureUser();
    const settings = await prisma.settings.upsert({
      where: { userId: DEFAULT_USER_ID },
      update: req.body,
      create: {
        ...req.body,
        userId: DEFAULT_USER_ID
      }
    });
    res.json(settings);
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// QR Code endpoints
app.get('/api/cards/:cardId/qrcodes', async (req, res) => {
  try {
    const qrCodes = await prisma.qRCode.findMany({
      where: { cardId: req.params.cardId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(qrCodes);
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    res.status(500).json({ error: 'Failed to fetch QR codes' });
  }
});

app.post('/api/qrcodes', async (req, res) => {
  try {
    const qrCode = await prisma.qRCode.create({
      data: req.body
    });
    res.json(qrCode);
  } catch (error) {
    console.error('Error creating QR code:', error);
    res.status(500).json({ error: 'Failed to create QR code' });
  }
});

app.delete('/api/qrcodes/:id', async (req, res) => {
  try {
    await prisma.qRCode.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    res.status(500).json({ error: 'Failed to delete QR code' });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});