# Registro presenze Google Sheets

La pagina `presenze.html` è già collegata alla navigazione del sito, ma per salvare i dati online serve configurare una volta Google Sheets.

## Configurazione (una tantum)

1. Crea un nuovo foglio Google: https://sheets.google.com/
2. Copia l'ID del foglio dall'URL: la parte tra `/d/` e `/edit`.
3. Apri https://script.google.com/ e crea un nuovo progetto Apps Script.
4. Sostituisci il contenuto di `Code.gs` con il codice del file `presenze-apps-script.gs` in questa repository.
5. Sostituisci `INSERISCI_ID_DEL_FOGLIO_GOOGLE` con l'ID copiato.
6. Salva il progetto. Seleziona **Distribuisci → Nuova distribuzione → App web**.
7. Esegui come **Me**. Per l'accesso scegli **Chiunque** (o l'opzione equivalente consentita dal tuo account), poi distribuisci e autorizza lo script.
8. Copia l'URL dell'app web che termina con `/exec`.
9. Apri https://ilbeppe90.github.io/Cronometro/presenze.html, premi **Configura**, incolla l'URL e premi **Salva URL e collega**.
10. Inserisci i nomi delle atlete una per riga e premi **Salva elenco atlete**.

Lo script crea automaticamente i fogli `Atlete` e `Presenze`. La pagina salva per data e atleta, permette di registrare presente/assente/giustificata e scaricare il CSV.

## Nota accessi
Se scegli “Chiunque”, chiunque abbia l'URL dello script potrebbe tentare di inviare dati. Non inserire informazioni sensibili. Se l'account Google non consente l'accesso pubblico, servirà un metodo di accesso diverso.
