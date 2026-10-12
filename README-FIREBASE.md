# Configurare l'archivio online del cronometro

La sezione “Risultati e test — importazione Excel” legge i file Excel nel browser e sincronizza i risultati in Cloud Firestore. Per mantenere l'archivio accessibile da più dispositivi, è necessario collegare un progetto Firebase gratuito (eventuali limiti e costi dipendono dall'uso e dal piano aggiornato di Firebase).

## 1. Crea il progetto Firebase

1. Apri https://console.firebase.google.com/ e crea un progetto.
2. In **Build → Authentication → Sign-in method**, abilita **Google**.
3. In **Build → Firestore Database**, crea un database Cloud Firestore.
4. Nelle impostazioni del progetto, aggiungi una **Web App** e copia la configurazione Firebase mostrata.

## 2. Inserisci la configurazione nel sito

Nel file `index.html`, cerca `firebaseResultsConfig` e sostituisci i valori `INSERISCI_...` con i valori della Web App Firebase (`apiKey`, `authDomain`, `projectId`, `appId`). Sono identificativi di configurazione client; non inserire mai una service-account key o una chiave privata nel sito.

## 3. Regole di sicurezza Firestore

Prima di usare dati reali, in **Firestore → Rules** inserisci la regola seguente, sostituendo `INSERISCI_UID_AUTORIZZATO` con l'UID dell'account Google autorizzato. L'UID si può leggere in Firebase Authentication dopo il primo accesso. Questa regola limita lettura e scrittura all'account indicato.

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/testResults/{resultId} {
      allow read, create, update, delete: if request.auth != null
        && request.auth.uid == userId
        && request.auth.uid == 'INSERISCI_UID_AUTORIZZATO';
    }
  }
}
```

Non usare regole pubbliche come `allow read, write: if true`: esporrebbero i dati a chiunque.

## 4. Pubblica e verifica

1. Salva le modifiche e pubblicale su GitHub Pages.
2. Accedi con Google nella sezione “Risultati e test”.
3. Seleziona la data, il tipo di test e un file Excel con intestazioni come:
   - `Atleta`
   - `1 km (Tempo)`
   - `3 km (Tempo) (1)`
   - `3 km (Tempo) (2)`
   - `3 km (Tempo) (3)`
   - `3 km (Tempo)`
   - `Ritmo 3 km`
   - `Note`
4. Premi **Leggi e controlla file**, verifica l'anteprima e poi **Importa nell'archivio online**.

L'importazione aggiunge nuove righe; non sovrascrive né deduplica automaticamente i risultati già importati. L'archivio è specifico dell'account autorizzato e viene caricato fino a 1.000 risultati nell'interfaccia. Esporta periodicamente un CSV come backup.
