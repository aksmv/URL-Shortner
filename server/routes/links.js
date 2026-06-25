const express = require('express');
const { UAParser } = require('ua-parser-js');
const Link = require('../models/Link');
const { generateShortCode, isValidCustomCode, isValidUrl } = require('../utils');
const { summarize } = require('../analytics');

const router = express.Router();

// POST /api/links - create a new short link
router.post('/links', async (req, res) => {
  try {
    const { url, customCode, title } = req.body;

    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: 'Please provide a valid http(s) URL.' });
    }

    let shortCode;
    if (customCode) {
      if (!isValidCustomCode(customCode)) {
        return res.status(400).json({
          error: 'Custom code must be 3-20 characters: letters, numbers, hyphens, underscores.',
        });
      }
      const existing = await Link.findOne({ shortCode: customCode });
      if (existing) {
        return res.status(409).json({ error: 'That custom code is already taken.' });
      }
      shortCode = customCode;
    } else {
      let attempts = 0;
      do {
        shortCode = generateShortCode();
        attempts += 1;
        // eslint-disable-next-line no-await-in-loop
        const collision = await Link.findOne({ shortCode });
        if (!collision) break;
      } while (attempts < 5);
    }

    const link = await Link.create({
      shortCode,
      originalUrl: url,
      title: title || '',
    });

    res.status(201).json(link);
  } catch (err) {
    console.error('Create link error:', err);
    res.status(500).json({ error: 'Something went wrong creating the link.' });
  }
});

// GET /api/links - list all links, newest first
router.get('/links', async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 }).lean();
    const withTrend = links.map((link) => ({
      ...link,
      trend7d: summarize(link).trend7d,
    }));
    res.json(withTrend);
  } catch (err) {
    console.error('List links error:', err);
    res.status(500).json({ error: 'Could not load links.' });
  }
});

// GET /api/links/:shortCode - get one link with full analytics
router.get('/links/:shortCode', async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.shortCode }).lean();
    if (!link) return res.status(404).json({ error: 'Link not found.' });
    res.json({ ...link, analytics: summarize(link) });
  } catch (err) {
    console.error('Get link error:', err);
    res.status(500).json({ error: 'Could not load link.' });
  }
});

// DELETE /api/links/:shortCode
router.delete('/links/:shortCode', async (req, res) => {
  try {
    const result = await Link.findOneAndDelete({ shortCode: req.params.shortCode });
    if (!result) return res.status(404).json({ error: 'Link not found.' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete link error:', err);
    res.status(500).json({ error: 'Could not delete link.' });
  }
});

// Separate router for the actual redirect, mounted at root in server.js
const redirectRouter = express.Router();

redirectRouter.get('/:shortCode', async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const link = await Link.findOne({ shortCode });

    if (!link) return next(); // fall through to 404 handler

    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(410).send('This link has expired.');
    }

    const parser = new UAParser(req.headers['user-agent'] || '');
    const uaResult = parser.getResult();

    link.clicks.push({
      timestamp: new Date(),
      referrer: req.get('referer') || 'direct',
      browser: uaResult.browser.name || 'unknown',
      os: uaResult.os.name || 'unknown',
      device: uaResult.device.type || 'desktop',
    });
    link.clickCount += 1;

    await link.save();

    res.redirect(302, link.originalUrl);
  } catch (err) {
    console.error('Redirect error:', err);
    res.status(500).send('Something went wrong.');
  }
});

module.exports = { router, redirectRouter };
