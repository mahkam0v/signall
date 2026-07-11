export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: "So'ralgan manzil topilmadi." });
};

export const errorHandler = (err, req, res, next) => {
  console.error('Server xatoligi:', err);
  res.status(500).json({ error: 'Serverda kutilmagan xatolik yuz berdi.' });
};
