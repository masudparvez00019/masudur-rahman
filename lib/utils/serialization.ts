export function serializeMongoDoc(doc: any): any {
  if (!doc) {
    return null;
  }

  if (Array.isArray(doc)) {
    return doc.map(item => serializeMongoDoc(item));
  }

  if (doc instanceof Date) {
    return doc.toISOString();
  }

  // Check for MongoDB ObjectId
  if (doc._id && typeof doc._id.toString === 'function') {
    const serialized: any = { ...doc };
    serialized._id = doc._id.toString();

    // Recursively serialize nested objects
    Object.keys(serialized).forEach(key => {
      if (serialized[key] && typeof serialized[key] === 'object') {
        serialized[key] = serializeMongoDoc(serialized[key]);
      }
    });

    return serialized;
  }

  if (typeof doc === 'object' && doc !== null) {
    const serialized: any = { ...doc };
    
    Object.keys(serialized).forEach(key => {
      if (serialized[key] && typeof serialized[key] === 'object') {
        serialized[key] = serializeMongoDoc(serialized[key]);
      }
    });

    return serialized;
  }

  return doc;
}