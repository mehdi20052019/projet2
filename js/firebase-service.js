const ORDERS_COLLECTION = "orders";
const FIREBASE_SDK_VERSION = "12.7.0";
const config = window.POWERSHIELD_FIREBASE_CONFIG || {};
const hasConfig = Boolean(config.apiKey && config.projectId && !String(config.apiKey).includes("YOUR_"));

let db = null;
let firebaseApi = null;

async function initFirebase() {
  if (!hasConfig || db) return;

  const [appModule, firestoreModule] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore.js`)
  ]);

  const app = appModule.initializeApp(config);
  db = firestoreModule.getFirestore(app);
  firebaseApi = firestoreModule;
}

async function saveOrder(order) {
  await initFirebase();
  if (!db) return null;

  const docRef = await firebaseApi.addDoc(firebaseApi.collection(db, ORDERS_COLLECTION), {
    ...order,
    firebaseCreatedAt: firebaseApi.serverTimestamp(),
    updatedAt: firebaseApi.serverTimestamp()
  });

  return docRef.id;
}

async function fetchOrders() {
  await initFirebase();
  if (!db) return [];

  const ordersQuery = firebaseApi.query(
    firebaseApi.collection(db, ORDERS_COLLECTION),
    firebaseApi.orderBy("createdAt", "desc")
  );
  const snapshot = await firebaseApi.getDocs(ordersQuery);
  return snapshot.docs.map(item => ({
    firebaseDocId: item.id,
    ...item.data()
  }));
}

async function updateOrderStatus(firebaseDocId, status) {
  await initFirebase();
  if (!db || !firebaseDocId) return false;

  await firebaseApi.updateDoc(firebaseApi.doc(db, ORDERS_COLLECTION, firebaseDocId), {
    status,
    updatedAt: firebaseApi.serverTimestamp()
  });
  return true;
}

async function deleteAllOrders() {
  await initFirebase();
  if (!db) return false;

  const snapshot = await firebaseApi.getDocs(firebaseApi.collection(db, ORDERS_COLLECTION));
  await Promise.all(snapshot.docs.map(item => {
    return firebaseApi.deleteDoc(firebaseApi.doc(db, ORDERS_COLLECTION, item.id));
  }));
  return true;
}

window.PowerShieldFirebase = {
  enabled: hasConfig,
  ready: initFirebase(),
  saveOrder,
  fetchOrders,
  updateOrderStatus,
  deleteAllOrders
};

window.PowerShieldFirebase.ready
  .then(() => {
    window.dispatchEvent(new CustomEvent("powershield:firebase-ready", {
      detail: { enabled: hasConfig }
    }));
  })
  .catch(error => {
    console.warn("Firebase initialization failed:", error);
    window.PowerShieldFirebase.enabled = false;
    window.dispatchEvent(new CustomEvent("powershield:firebase-ready", {
      detail: { enabled: false }
    }));
  });
