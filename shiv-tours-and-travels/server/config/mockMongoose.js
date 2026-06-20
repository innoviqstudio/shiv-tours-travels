import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'server', 'db.json');

function readJSON() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    return {};
  }
}

function writeJSON(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const isPlaceholder = !process.env.MONGO_URI || 
                     process.env.MONGO_URI.includes('<username>') || 
                     process.env.MONGO_URI.includes('xxxxx');

if (isPlaceholder) {
  console.log('⚠️ Using file-based Mock Database (server/db.json) as MONGO_URI is not configured.');

  // Mock mongoose.connect to succeed immediately
  mongoose.connect = async () => {
    console.log('MongoDB Connected: (Mocked Local JSON DB)');
    
    // Seed initial empty collections if they don't exist in db.json
    const db = readJSON();
    let updated = false;
    ['users', 'vehicles', 'packages', 'reviews', 'inquiries'].forEach(col => {
      if (!db[col]) {
        db[col] = [];
        updated = true;
      }
    });
    if (updated) {
      writeJSON(db);
    }

    return {
      connection: {
        host: 'localhost (Mock)'
      }
    };
  };

  // Mock mongoose.model to return a MockModel class
  mongoose.model = function (name, schema) {
    const collectionName = name.toLowerCase() + 's';

    class Model {
      constructor(data = {}) {
        this._collectionName = collectionName;
        Object.assign(this, data);
        if (!this._id && !this.id) {
          this._id = 'mock_' + Math.random().toString(36).substring(2, 9);
          this.id = this._id;
        }
      }

      async save() {
        const db = readJSON();
        if (!db[this._collectionName]) db[this._collectionName] = [];
        const index = db[this._collectionName].findIndex(item => item._id === this._id || item.id === this.id);
        const cleanData = { ...this };
        delete cleanData._collectionName;
        if (index !== -1) {
          db[this._collectionName][index] = cleanData;
        } else {
          db[this._collectionName].push(cleanData);
        }
        writeJSON(db);
        return this;
      }

      static get collectionName() {
        return collectionName;
      }

      static countDocuments() {
        const db = readJSON();
        const list = db[collectionName] || [];
        return Promise.resolve(list.length);
      }

      static find(query = {}) {
        const db = readJSON();
        let list = db[collectionName] || [];
        if (query && Object.keys(query).length > 0) {
          list = list.filter(item => {
            if (query.status && query.status !== 'all' && item.status !== query.status) return false;
            if (query.username && item.username !== query.username) return false;
            if (query.$or) {
              return query.$or.some(qCond => {
                return Object.entries(qCond).some(([key, val]) => {
                  const regexVal = val && val.$regex;
                  if (regexVal) {
                    const regex = new RegExp(regexVal, 'i');
                    return regex.test(item[key]);
                  }
                  return item[key] === val;
                });
              });
            }
            return Object.entries(query).every(([k, v]) => item[k] === v);
          });
        }
        const result = [...list];
        const queryObj = {
          sort(sortQuery) {
            if (sortQuery.createdAt) {
              result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            return this;
          },
          then(onFulfilled) {
            return Promise.resolve(result).then(onFulfilled);
          }
        };
        return queryObj;
      }

      static findOne(query = {}) {
        const db = readJSON();
        let list = db[collectionName] || [];
        const found = list.find(item => {
          return Object.entries(query).every(([k, v]) => item[k] === v);
        });
        return {
          then(onFulfilled) {
            return Promise.resolve(found || null).then(onFulfilled);
          }
        };
      }

      static findById(id) {
        const db = readJSON();
        let list = db[collectionName] || [];
        const found = list.find(item => item._id === id || item.id === id);
        return {
          then(onFulfilled) {
            return Promise.resolve(found || null).then(onFulfilled);
          }
        };
      }

      static async create(data) {
        const db = readJSON();
        if (!db[collectionName]) db[collectionName] = [];
        const items = Array.isArray(data) ? data : [data];
        const createdItems = [];
        for (const item of items) {
          const newItem = {
            _id: 'mock_' + Math.random().toString(36).substring(2, 9),
            id: 'mock_' + Math.random().toString(36).substring(2, 9),
            ...item,
            createdAt: item.createdAt || new Date().toISOString()
          };
          db[collectionName].push(newItem);
          createdItems.push(newItem);
        }
        writeJSON(db);
        return Array.isArray(data) ? createdItems : createdItems[0];
      }

      static async deleteMany(query = {}) {
        const db = readJSON();
        let list = db[collectionName] || [];
        const remaining = list.filter(item => {
          return !Object.entries(query).every(([k, v]) => {
            if (v && typeof v === 'object') {
              if (v.$ne !== undefined) return item[k] !== v.$ne;
            }
            return item[k] === v;
          });
        });
        db[collectionName] = remaining;
        writeJSON(db);
        return { deletedCount: list.length - remaining.length };
      }

      static async findByIdAndUpdate(id, updateData, options = {}) {
        const db = readJSON();
        let list = db[collectionName] || [];
        const index = list.findIndex(item => item._id === id || item.id === id);
        if (index !== -1) {
          list[index] = { ...list[index], ...updateData };
          db[collectionName] = list;
          writeJSON(db);
          return list[index];
        }
        return null;
      }

      static async findByIdAndDelete(id) {
        const db = readJSON();
        let list = db[collectionName] || [];
        const index = list.findIndex(item => item._id === id || item.id === id);
        if (index !== -1) {
          const deleted = list[index];
          list.splice(index, 1);
          db[collectionName] = list;
          writeJSON(db);
          return deleted;
        }
        return null;
      }
    }

    return Model;
  };
}
