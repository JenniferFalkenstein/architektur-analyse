[zurück](../REPORT.md)
# Testbarkeit
Score: 1.3333333333333333 (=Hervorragend (=1))
| Metrik | Score | Bewertungsskala |
| -------- | -------- | -------- |
| [Komplexität](#komplexität) | 5.56 | 1 (=Hervorragend (=1)) |
| [Kopplung](#kopplung) | 2.56 | 2 (=Gut (=2)) |
| [Kohäsion](#kohäsion) | 0.81 | 1 (=Hervorragend (=1)) |
-----
## Komplexität
**Zyklomatische Komplexität**
 
*Beschreibung: Misst die Zyklomatische Komplexität einer Methode basierend auf der **Anzahl unabhängiger Pfade** im Kontrollflussgraphen nach der Formel von McCabe. Ein hoher Wert (erzeugt durch beispielsweise viele Verzweigungen) deutet auf eine schwer verständliche, fehleranfällige und testintensive Methode hin.*
 
Gesamt-Komplexität: Hervorragend (=1)
 
**Interpretation der Werte:**
| Score | Bewertung |
| -------- | -------- |
| 0 - 10 | Hervorragend (=1) |
| 11 - 20 | Gut (=2) |
| 21 - 30 | Okay (=3) |
| 31 - 40 | Nicht Okay (=4) |
| > 40 | Grauenvoll (=5) |
 
**Details zu Problem-Modulen:**
| Modul | Score | Beschreibung |
| -------- | -------- | -------- |
false
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/controllers/ManagementController.ts | 31.00 (Bewertungsskala: 4 = Nicht Gut (=4)) | Funktion handleManagementTask hat eine Zyklomatische Komplexität von 31 (=Nicht Gut (=4)) |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/services/TripPlannerService.ts | 36.00 (Bewertungsskala: 4 = Nicht Gut (=4)) | Funktion planTrip hat eine Zyklomatische Komplexität von 36 (=Nicht Gut (=4)) |
-----
**Verbesserungsvorschläge:**
- **Extrahiere (Refactoring):** Zerlege die komplexe Funktion in mehrere kleinere, spezialisierte Methoden. Jede extrahierte Methode sollte idealerweise eine Zyklomatische Komplexität von unter 10 aufweisen
- **Vermeide tiefe Schachtelung:** Reduziere die Verschachtelungstiefe von `if`-Anweisungen, z.B. durch frühe Rückgabe bei Fehlerfällen oder ungültigen Zuständen
- **Nutze Polymorphie:** Wenn die Verzweigungen auf unterschiedlichen Typen oder Zuständen basieren, nutze **Polymorphie** (Vererbung oder Interfaces) statt expliziter Typ- oder Zustandsprüfungen in der Funktion
- **Kapsle Ausnahmebehandlung:** Prüfe, ob die Zählung von `try/catch`-Blöcken reduziert werden kann, indem die Fehlerbehandlung in dedizierte Schichten oder Wrapper-Funktionen ausgelagert wird
## Kopplung
**Efferente Kopplung**
 
*Beschreibung: Misst die **funktionale Kopplung** eines Moduls basierend auf der **Anzahl der von ihm importierten lokalen Module und Services**. Eine hohe Anzahl von Imports (Efferent Coupling) deutet auf eine geringe Unabhängigkeit, erhöhte Wartungskosten und eine geringere Testbarkeit des Moduls hin.*
 
Gesamt-Komplexität: Gut (=2)
 
**Interpretation der Werte:**
| Score | Bewertung |
| -------- | -------- |
| 0 - 1 | Hervorragend (=1) |
| 2 - 4 | Gut (=2) |
| 5 - 7 | Okay (=3) |
| 8 - 11 | Nicht Okay (=4) |
| > 12 | Grauenvoll (=5) |
 
**Details zu Problem-Modulen:**
| Modul | Score | Beschreibung |
| -------- | -------- | -------- |
false
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/services/BookingService.ts | 11.00 (Bewertungsskala: 4 = Nicht Gut (=4)) | Dieses Modul hat eine hohe Anzahl an Imports (11), was auf eine starke Kopplung hinweist |
-----
**Verbesserungsvorschläge:**
- **Wende das Single Responsibility Principle (SRP) an:** Überprüfe, ob das Modul zu viele unterschiedliche Aufgaben übernimmt, welche die Nutzung verschiedener, unabhängiger Services erforderlich machen
- **Wende das Dependency Inversion Principle (DIP) an:** Verwende Interfaces und Abstraktionen statt konkreter Klassen, um die direkte Abhängigkeit zu reduzieren (Inversion of Control/Dependency Injection)
- **Übergib benötigte Daten über Funktionsparameter:** Vermeide den Import ganzer Services, nur um auf statische Konfigurationen oder Hilfsfunktionen zuzugreifen, die besser als Parameter oder einfache Utility-Funktionen übergeben werden könnten
## Kohäsion
**Methodennamen-Kohäsion**
 
*Beschreibung: Misst die funktionale Kohäsion eines Moduls, indem die semantische Ähnlichkeit der Methodennamen analysiert wird. Dabei wird untersucht, ob die Methodennamen gemeinsame Domänen- und, falls vorhanden, Sub-Domänen-Begriffe enthalten. Hohe Ähnlichkeit deutet auf eine Konzentration auf eine **einzelne Verantwortlichkeit (Single Responsibility Principle)** und somit auf eine höhere Kohäsion hin.*
 
Gesamt-Komplexität: Hervorragend (=1)
 
**Interpretation der Werte:**
| Score | Bewertung |
| -------- | -------- |
| > 0.8 - 1 | Hervorragend (=1) |
| > 0.6 - 0.8 | Gut (=2) |
| > 0.4 - 0.6 | Okay (=3) |
| > 0.2 - 0.4 | Nicht Okay (=4) |
| 0 - 0.2 | Grauenvoll (=5) |
 
**Details zu Problem-Modulen:**
| Modul | Score | Beschreibung |
| -------- | -------- | -------- |
false
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/reports/AnalyticsGenerator.ts | 0.14 (Bewertungsskala: 5 = Grauenvoll (=5)) | Kohäsion wird durch folgende Funktionen beeinträchtig, da sie weder mit der Hauptdomäne ("User"), noch mit der Sub-Domäne (UserPreferences) übereinzustimmen scheinen: trackPageView, processRefund, checkSystemHealth, generateRandomId, formatDate |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/repositories/TravelerRepository.ts | 0.00 (Bewertungsskala: 5 = Grauenvoll (=5)) | Für dieses Modul konnte keine gemeinsame Hauptdomäne gefunden werden. Kohäsion ist daher nicht gegeben! |
-----
**Verbesserungsvorschläge:**
- Überprüfe, ob die enthaltenen Methoden dem **Single Responsibility Principle (SRP)** folgen, d.h., ob sie thematisch nur eine einzige Verantwortlichkeit verfolgen
- **Extrahiere (Refactoring)** thematisch nicht zusammengehörige Funktionen in separate, dedizierte Module oder Services. Jedes Modul sollte eine klare Domäne oder Sub-Domäne abbilden
- **Passe die Methodennamen an**, indem du konsistente Präfixe oder Namenskonventionen verwendest, die die Domäne des Moduls widerspiegeln (z.B. statt 'getId' und 'getData' lieber 'getUserId' und 'getUserData')