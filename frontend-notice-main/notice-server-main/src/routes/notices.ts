
import express from 'express';
import { authenticateToken, isTeacherOrAdmin } from '../middleware/auth';
import { prisma } from '../index';

const router = express.Router();

// Get all notices
router.get('/', authenticateToken, async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.status(200).json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ message: 'Error fetching notices' });
  }
});

// Create a notice (teachers and admins only)
router.post('/', authenticateToken, isTeacherOrAdmin, async (req, res) => {
  try {
    const { title, content, priority, expiresAt } = req.body;
    const userId = req.user?.id;
    
    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        priority: priority || 'MEDIUM',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        authorId: userId!,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    
    res.status(201).json(notice);
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ message: 'Error creating notice' });
  }
});

// Delete a notice
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    
    // Check if notice exists
    const notice = await prisma.notice.findUnique({
      where: { id },
      include: { author: true },
    });
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    // Check permissions (admin can delete any, teachers can delete only their own)
    if (userRole !== 'ADMIN' && notice.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this notice' });
    }
    
    // Delete the notice
    await prisma.notice.delete({
      where: { id },
    });
    
    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ message: 'Error deleting notice' });
  }
});

export default router;
