# Projekt-Bewertung
Ergebnis: 1.7666666666666668 (=Gut (=2))
## Wartbarkeit
| Sub-Charakteristik | Score | Details |
| -------- | -------- | -------- |
| Analysierbarkeit | 1.5 (=Gut (=2)) | [Bericht](detailed/analyzability.md) |
| Modularität | 2 (=Gut (=2)) | [Bericht](detailed/modularity.md) |
| Wiederverwendbarkeit | 1.6666666666666667 (=Gut (=2)) | [Bericht](detailed/reusability.md) |
| Modifizierbarkeit | 2 (=Gut (=2)) | [Bericht](detailed/modifiability.md) |
| Testbarkeit | 1.6666666666666667 (=Gut (=2)) | [Bericht](detailed/testability.md) |
## Problemmodule
| Modul | Probleme |
| -------- | -------- |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-bibliothek/src/services/BookService.ts | 1. Kohäsion wird durch folgende Funktionen beeinträchtig, da sie weder mit der Hauptdomäne ("Book"), noch mit der Sub-Domäne (BookWith) übereinzustimmen scheinen: addMagazine, deleteMagazine, addMovie, deleteMovie, addComic, deleteComic<br>2. Dieses Modul hat eine hohe Anzahl an Imports (10), was auf eine starke Kopplung hinweist |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-bibliothek/src/services/LendingService.ts | 1. Funktion processLoan hat eine Zyklomatische Komplexität von 35 (=Nicht Gut (=4))<br>2. Funktion `processLoan` in dem Modul hat eine Größe von 93 Zeilen |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-bibliothek/src/reports/ReportGenerator.ts | Für dieses Modul konnte keine gemeinsame Hauptdomäne gefunden werden. Kohäsion ist daher nicht gegeben! |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-bibliothek/src/controllers/AdminController.ts | Funktion `processRequest` in dem Modul hat eine Größe von 76 Zeilen |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-bibliothek/src/events/EventHandler.ts | Funktion `handleEvent` in dem Modul hat eine Größe von 75 Zeilen |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-bibliothek/src/repositories/LendingRepository.ts | Funktion `getLoanDetailsAndHistory` in dem Modul hat eine Größe von 59 Zeilen |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-bibliothek/src/repositories/UserRepository.ts | Dieses Modul hat eine hohe Propagation Cost von 0.44, da es 8 von insgesamt 18 Modulen beeinflusst |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-bibliothek/src/services/NotificationService.ts | Dieses Modul hat eine hohe Propagation Cost von 0.39, da es 7 von insgesamt 18 Modulen beeinflusst |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-bibliothek/src/repositories/AuthorRepository.ts | Dieses Modul hat eine hohe Propagation Cost von 0.33, da es 6 von insgesamt 18 Modulen beeinflusst |