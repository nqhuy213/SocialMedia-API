module.exports = (error, req, res, next) => {
  const { statusCode = 500, message, data } = error;

  res.status(500).json({error: true,  message});
};
