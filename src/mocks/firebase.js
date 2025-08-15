export const mockFirestore = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  get: jest.fn().mockResolvedValue({
    exists: true,
    data: () => ({
      title: 'Mock Ensaio',
      normas: ['ABNT NBR 123']
    })
  }),
  setDoc: jest.fn().mockResolvedValue(true),
  where: jest.fn().mockReturnThis(),
  getDocs: jest.fn().mockResolvedValue({
    docs: [
      {
        id: '1',
        data: () => ({ title: 'Ensaio 1' })
      }
    ]
  })
};

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getFirestore: () => mockFirestore,
  collection: mockFirestore.collection,
  doc: mockFirestore.doc,
  getDoc: mockFirestore.get,
  setDoc: mockFirestore.setDoc,
  where: mockFirestore.where,
  getDocs: mockFirestore.getDocs
}));