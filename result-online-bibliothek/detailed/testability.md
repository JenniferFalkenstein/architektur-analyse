[zurück](../REPORT.md)
# Testbarkeit
Score: 1 (=Hervorragend (=1))
| Metrik | Score | Bewertungsskala |
| -------- | -------- | -------- |
| [Komplexität](#komplexität) | 4.97 | 1 (=Hervorragend (=1)) |
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