// We use this middlware function to avoid writing try/catch blocks in every route.
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

export default asyncHandler;
