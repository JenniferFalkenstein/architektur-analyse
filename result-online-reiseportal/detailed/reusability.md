[zurück](../REPORT.md)
# Wiederverwendbarkeit
Score: 1.6666666666666667 (=Gut (=2))
| Metrik | Score | Bewertungsskala |
| -------- | -------- | -------- |
| [Ausbreitung](#ausbreitung) | 0.20 | 2 (=Gut (=2)) |
| [Kohäsion](#kohäsion) | 0.81 | 1 (=Hervorragend (=1)) |
| [Kopplung](#kopplung) | 2.56 | 2 (=Gut (=2)) |
-----
## Ausbreitung
**Propagation Cost (Ausbreitungskosten)**
 
*Beschreibung: Misst die Propagation Cost eines Moduls, indem die potenziellen Auswirkungen einer Änderung an diesem Modul auf andere abhängige Module analysiert werden. Hierbei werden nicht nur direkt abhängige Module analysiert, sondern auch indirekt abhängige. Beispiel: Modul A beeinflusst direkt Modul B. Modul C greift aber auch auf Modul B zu, daher wird Modul C indirekt von Modul A mitbeeinflusst. Ein hoher Wert deutet darauf hin, dass eine Änderung dieses Moduls eine **Kaskade von Folgeänderungen** oder umfangreiche Regressionstests in anderen Teilen der Anwendung erfordert.*
 
Gesamt-Komplexität: Gut (=2)
 
**Interpretation der Werte:**
| Score | Bewertung |
| -------- | -------- |
| 0 - 0.1 | Hervorragend (=1) |
| > 0.1 - 0.2 | Gut (=2) |
| > 0.2 - 0.3 | Okay (=3) |
| > 0.3 - 0.5 | Nicht Okay (=4) |
| > 0.5 | Grauenvoll (=5) |
 
**Details zu Problem-Modulen:**
| Modul | Score | Beschreibung |
| -------- | -------- | -------- |
false
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/repositories/TravelerRepository.ts | 0.50 (Bewertungsskala: 4 = Nicht Gut (=4)) | Dieses Modul hat eine hohe Propagation Cost von 0.50, da es 9 von insgesamt 18 Modulen beeinflusst |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/services/TravelerService.ts | 0.39 (Bewertungsskala: 4 = Nicht Gut (=4)) | Dieses Modul hat eine hohe Propagation Cost von 0.39, da es 7 von insgesamt 18 Modulen beeinflusst |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/repositories/TripRepository.ts | 0.39 (Bewertungsskala: 4 = Nicht Gut (=4)) | Dieses Modul hat eine hohe Propagation Cost von 0.39, da es 7 von insgesamt 18 Modulen beeinflusst |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/services/TripPlannerService.ts | 0.33 (Bewertungsskala: 4 = Nicht Gut (=4)) | Dieses Modul hat eine hohe Propagation Cost von 0.33, da es 6 von insgesamt 18 Modulen beeinflusst |
-----
**Verbesserungsvorschläge:**
- **Reduziere die Anzahl der abhängigen Module (Efferent Coupling):** Versuche, die Anzahl der Stellen im Code zu verringern, die dieses Modul importieren, da jede dieser Stellen bei einer Änderung betroffen sein kann
- **Kapsle interne Details:** Mache Implementierungsdetails (z.B. interne Datenstrukturen, private Hilfsfunktionen) nicht über die öffentliche Schnittstelle zugänglich, um zu verhindern, dass externe Module von ihnen abhängig werden
- **Definiere stabile Abstraktionen:** Wenn das Modul als zentraler Dienst (Hub) dient, sollte seine Schnittstelle (API) hochstabil sein, damit abhängige Module nicht ständig angepasst werden müssen
-----
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
-----
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