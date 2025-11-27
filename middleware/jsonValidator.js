const express = require('express');

module.exports = (req, res, next) => {
	try {
		if (req.body && typeof req.body === 'string') {
			req.body = JSON.parse(req.body);
		}

		// Validate required fields
		const requiredFields = ['nome', 'codigo', 'descricao', 'categoria_id', 'fabricante_id'];
		const missingFields = requiredFields.filter(field => !(field in req.body));

		if (missingFields.length > 0) {
			return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
		}

		next();
	} catch (err) {
		return res.status(400).json({ error: 'Invalid JSON format' });
	}
};
