# Projekt-Bewertung
Ergebnis: 1.5333333333333332 (=Gut (=2))
## Wartbarkeit
| Sub-Charakteristik | Score | Details |
| -------- | -------- | -------- |
| Analysierbarkeit | 1.5 (=Gut (=2)) | [Bericht](detailed/analyzability.md) |
| Modularität | 1.5 (=Gut (=2)) | [Bericht](detailed/modularity.md) |
| Wiederverwendbarkeit | 1.3333333333333333 (=Hervorragend (=1)) | [Bericht](detailed/reusability.md) |
| Modifizierbarkeit | 2 (=Gut (=2)) | [Bericht](detailed/modifiability.md) |
| Testbarkeit | 1.3333333333333333 (=Hervorragend (=1)) | [Bericht](detailed/testability.md) |
## Problemmodule
| Modul | Probleme |
| -------- | -------- |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/services/TripPlannerService.ts | 1. Funktion planTrip hat eine Zyklomatische Komplexität von 36 (=Nicht Gut (=4))<br>2. Funktion `planTrip` in dem Modul hat eine Größe von 99 Zeilen<br>3. Dieses Modul hat eine hohe Propagation Cost von 0.33, da es 6 von insgesamt 18 Modulen beeinflusst |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/repositories/TravelerRepository.ts | 1. Für dieses Modul konnte keine gemeinsame Hauptdomäne gefunden werden. Kohäsion ist daher nicht gegeben!<br>2. Dieses Modul hat eine hohe Propagation Cost von 0.50, da es 9 von insgesamt 18 Modulen beeinflusst |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/controllers/ManagementController.ts | 1. Funktion handleManagementTask hat eine Zyklomatische Komplexität von 31 (=Nicht Gut (=4))<br>2. Funktion `handleManagementTask` in dem Modul hat eine Größe von 139 Zeilen |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/reports/AnalyticsGenerator.ts | Kohäsion wird durch folgende Funktionen beeinträchtig, da sie weder mit der Hauptdomäne ("User"), noch mit der Sub-Domäne (UserPreferences) übereinzustimmen scheinen: trackPageView, processRefund, checkSystemHealth, generateRandomId, formatDate |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/services/BookingService.ts | Dieses Modul hat eine hohe Anzahl an Imports (11), was auf eine starke Kopplung hinweist |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/events/TripEventHandler.ts | Funktion `handleTripEvent` in dem Modul hat eine Größe von 61 Zeilen |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/repositories/BookingRepository.ts | Funktion `getBookingDetails` in dem Modul hat eine Größe von 56 Zeilen |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/services/TravelerService.ts | Dieses Modul hat eine hohe Propagation Cost von 0.39, da es 7 von insgesamt 18 Modulen beeinflusst |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/repositories/TripRepository.ts | Dieses Modul hat eine hohe Propagation Cost von 0.39, da es 7 von insgesamt 18 Modulen beeinflusst |