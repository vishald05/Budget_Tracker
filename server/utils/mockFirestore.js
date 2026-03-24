class MockFirestore {
    constructor() {
        this.store = {}; // { collection: { docId: data } }
        console.warn('⚠️  USING IN-MEMORY MOCK DATABASE. DATA WILL BE LOST ON RESTART. ⚠️');
    }

    collection(name) {
        if (!this.store[name]) this.store[name] = {};
        return new MockCollection(this.store[name], name);
    }
}

class MockCollection {
    constructor(data, name) {
        this.data = data;
        this.name = name;
        this.query = Object.values(data);
    }

    doc(id) {
        return new MockDoc(this.data, id);
    }

    async add(docData) {
        const id = Math.random().toString(36).substring(7);
        this.data[id] = { id, ...docData };
        return { id, ...this.data[id] };
    }

    where(field, op, val) {
        // Simple filter support
        this.query = this.query.filter(item => {
            if (op === '==') return item[field] === val;
            if (op === '>') return item[field] > val;
            if (op === '<') return item[field] < val;
            if (op === '>=') return item[field] >= val;
            if (op === '<=') return item[field] <= val;
            return true;
        });
        return this;
    }

    orderBy(field, dir = 'asc') {
        this.query.sort((a, b) => {
            if (a[field] < b[field]) return dir === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return dir === 'asc' ? 1 : -1;
            return 0;
        });
        return this;
    }

    async get() {
        // Return QuerySnapshot mock
        return {
            forEach: (cb) => this.query.forEach(item => cb({ id: item.id, data: () => item })),
            empty: this.query.length === 0,
            docs: this.query.map(item => ({ id: item.id, data: () => item }))
        };
    }
}

class MockDoc {
    constructor(collectionData, id) {
        this.collectionData = collectionData;
        this.id = id;
    }

    async get() {
        const data = this.collectionData[this.id];
        return {
            exists: !!data,
            data: () => data,
            id: this.id
        };
    }

    async set(data) {
        this.collectionData[this.id] = { id: this.id, ...data };
    }

    async update(data) {
        if (this.collectionData[this.id]) {
            this.collectionData[this.id] = { ...this.collectionData[this.id], ...data };
        }
    }

    async delete() {
        delete this.collectionData[this.id];
    }
}

module.exports = { MockFirestore };
