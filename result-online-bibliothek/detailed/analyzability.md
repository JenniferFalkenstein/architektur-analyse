[zurück](../REPORT.md)
# Analysierbarkeit
Score: 1.5 (=Gut (=2))
| Metrik | Score | Bewertungsskala |
| -------- | -------- | -------- |
| [Komplexität](#komplexität) | 4.97 | 1 (=Hervorragend (=1)) |
| [Größe](#größe) | 19.35 | 2 (=Gut (=2)) |
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
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-bibliothek/src/services/LendingService.ts | 35.00 (Bewertungsskala: 4 = Nicht Gut (=4)) | Funktion processLoan hat eine Zyklomatische Komplexität von 35 (=Nicht Gut (=4)) |
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
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-bibliothek/src/controllers/AdminController.ts | 76.00 (Bewertungsskala: 5 = Grauenvoll (=5)) | Funktion `processRequest` in dem Modul hat eine Größe von 76 Zeilen |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-bibliothek/src/events/EventHandler.ts | 75.00 (Bewertungsskala: 5 = Grauenvoll (=5)) | Funktion `handleEvent` in dem Modul hat eine Größe von 75 Zeilen |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-bibliothek/src/services/LendingService.ts | 93.00 (Bewertungsskala: 5 = Grauenvoll (=5)) | Funktion `processLoan` in dem Modul hat eine Größe von 93 Zeilen |
| /Users/jenniferfalkenstein/Desktop/Projekte/Masterarbeit/backend-online-bibliothek/src/repositories/LendingRepository.ts | 31.00 (Bewertungsskala: 3 = Okay (=3)) | Funktion `getLoanDetailsAndHistory` in dem Modul hat eine Größe von 59 Zeilen |
-----
**Verbesserungsvorschläge:**
- **Refactoring durch Extraktion:** Identifiziere logisch abgrenzbare Blöcke innerhalb der Funktion und lagere diese als private, gut benannte Hilfsfunktionen (Helper Methods) aus
- **Wende das Single Responsibility Principle (SRP) an:** Überprüfe, ob die Funktion mehrere unabhängige Schritte durchführt (z.B. Validierung, Berechnung, Speicherung). Teile die Funktion entlang dieser Verantwortlichkeiten auf
- **Reduziere die Komplexität:** Oft geht eine hohe Funktionslänge mit einer hohen Zyklomatischen Komplexität einher. Konzentriere dich darauf, Verzweigungen und Schachtelungen zu reduzieren, was die Länge automatisch verringert