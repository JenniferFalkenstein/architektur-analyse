[zurück](../REPORT.md)
# Modifizierbarkeit
Score: 2 (=Gut (=2))
| Metrik | Score | Bewertungsskala |
| -------- | -------- | -------- |
| [Ausbreitung](#ausbreitung) | 0.20 | 2 (=Gut (=2)) |
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