
const requestTimer = (req, res, next) => {
  // Record the start time
  const start = process.hrtime();

  // Once the response is finished
  res.on('finish', () => {
    // Calculate the time difference
    const diff = process.hrtime(start);
    // Convert to milliseconds
    const time = diff[0] * 1e3 + diff[1] * 1e-6;

    console.log(`requestTimer: ${req.method} ${req.originalUrl} - ${time.toFixed(2)}ms`);
  });

  // Pass control to the next middleware
  next();
};

export default requestTimer;