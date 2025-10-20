[zurück](../REPORT.md)
# Analysierbarkeit
Score: 1.5 (=Gut (=2))
| Metrik | Score | Bewertungsskala |
| -------- | -------- | -------- |
| [Komplexität](#komplexität) | 5.56 | 1 (=Hervorragend (=1)) |
| [Größe](#größe) | 23.30 | 2 (=Gut (=2)) |
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
-----
## Größe
**Funktionslänge**
 
*Beschreibung: Misst die Größe eines Moduls basierend auf ihrer Anzahl von Zeilen an Code (LOC = Lines of Code). Eine exzessive Länge deutet oft auf eine Verletzung des Single Responsibility Principle (SRP), erschwerte Wartung, geringere Verständlichkeit und potenziell hohe Komplexität hin.*
 
Gesamt-Größe: Gut (=2)
 
**Interpretation der Werte:**
| Score | Bewertung |
| -------- | -------- |
| 0 - 15 | Hervorragend (=1) |
| 16 - 25 | Gut (=2) |
| 26 - 40 | Okay (=3) |
| 41 - 60 | Nicht Okay (=4) |
| > 60 | Grauenvoll (=5) |
 
**Details zu Problem-Modulen:**
| Modul | Score | Beschreibung |
| -------- | -------- | -------- |
false
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/controllers/ManagementController.ts | 139.00 (Bewertungsskala: 5 = Grauenvoll (=5)) | Funktion `handleManagementTask` in dem Modul hat eine Größe von 139 Zeilen |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/events/TripEventHandler.ts | 61.00 (Bewertungsskala: 5 = Grauenvoll (=5)) | Funktion `handleTripEvent` in dem Modul hat eine Größe von 61 Zeilen |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/services/TripPlannerService.ts | 99.00 (Bewertungsskala: 5 = Grauenvoll (=5)) | Funktion `planTrip` in dem Modul hat eine Größe von 99 Zeilen |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-reiseportal/src/repositories/BookingRepository.ts | 29.50 (Bewertungsskala: 3 = Okay (=3)) | Funktion `getBookingDetails` in dem Modul hat eine Größe von 56 Zeilen |
-----
**Verbesserungsvorschläge:**
- **Refactoring durch Extraktion:** Identifiziere logisch abgrenzbare Blöcke innerhalb der Funktion und lagere diese als private, gut benannte Hilfsfunktionen (Helper Methods) aus
- **Wende das Single Responsibility Principle (SRP) an:** Überprüfe, ob die Funktion mehrere unabhängige Schritte durchführt (z.B. Validierung, Berechnung, Speicherung). Teile die Funktion entlang dieser Verantwortlichkeiten auf
- **Reduziere die Komplexität:** Oft geht eine hohe Funktionslänge mit einer hohen Zyklomatischen Komplexität einher. Konzentriere dich darauf, Verzweigungen und Schachtelungen zu reduzieren, was die Länge automatisch verringert