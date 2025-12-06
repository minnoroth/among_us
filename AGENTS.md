# Among Us

Budeme programovat jednoduchou aplikaci pro **přípravu** na hru Among Us v reálném světě.

## Technikálie

* Budeme používat React.js (MUI knihovnu), Next.js pokud bude potřeba a Typescript komponenty.
* Jako package manager chci yarn
* Nasazovat budeme do vercelu.
* Na další technologie, které bys potřeboval se mě zeptej

## Popis přípravy hry

DISCLAIMER: Nebudeme programovat hru samotnou, pouze jednoduchou webovou aplikaci, která rozlosuje úkoly + roli Impostora.

### Lobby

* Budeme mít v rámci lobby jednoduché tlačítko připojit se do hry, které uživatel klikne na webu. V tu chvíli ho to hodí do fronty s ostatními - ať je tam celkový počet hráčů.
* Nad tlačítkem "Zahájit hru" chci mít ještě jednoduchý Number Input, kde zadám celkový počet Impostorů pro danou hru.
* Zároveň v rámci lobby chci mít někde úplně dole tlačítko "Zahájit hru" - tahle funkcionalita rozdá lidem úkoly a mezi nimi může být i speciální role Impostora.

### Rozlosování úkolů = zahájení hry

* Po kliknutí na tlačítko "Zahájit hru" se uživatelům náhodně přidělí 6 kartiček úkolů, mezi kterými může být i speciální kartička role Impostora.
* V každé hře chceme mít počet Impostorů podle zadaného počtu v lobby.
* Pod zobrazenými kartičkami bych chtěl mít ještě tlačítko "Ukončit hru" - po jeho stisknutí se spustí modál, kde se tě zeptá, jestli chceš opravdu ukončit hru a až po potvrzení v modálu bude momentální hra ukončena a načte se opět stránka Lobby.

### Seznam úkolů

1. Pikat se zavřenýma očima do 10ti+před pikolou za pikolou…
2. Záchod - předveď, že kakáš.
3. Udělej 10 dřepů.
4. Udělej 10 kliků.
5. Zazpívej skákal pes přes oves.
6. Postav malou pyramidu z karet.
7. Čti nahlas v knize stranu… 
8. Stůj na 1 noze a počítej do 60 vteřin.
9. Dej si s někým páku.
10. Vypij sklenici vody.
11. Lehni si na matračku a napočítej 40 oveček.
12. 10x se pokloň skřítkovi.
13. Napiš 20 slov na písmeno "m".
14. Veď cca dvouminutový monolog na téma "Jak vést nováčkovský trénink".
15. Předstírej čištění zubů cca 1 minutu.
16. Předstírej, že si dáváš vanu cca 1 minutu.
17. Bež do kuchyně a zařvi, Máš hlad? a počkáš na odpověď.
18. Sedni si před krb a předstírej, že opékáš špekáčky.
19. Vyfoť selfie a pošli to do Discord kanálu among-us.
20. Vyjdi ven, sundej si kalhoty a zařvi: "Chce tady někdo sex?".
21. Předstírej, že přebaluješ dítě cca 1 minutu.
22. Dojdi pro 2 kusy dřeva do kůlny.

## UI

### Lobby

* Jednoduché tlačítko "Připojit se do hry"
* Jednoduchý Number Input s labelem "Počet Impostorů"
* Jednoduché tlačítko "Zahájit hru" - zobrazí modál "Opravdu chceš zahájit hru?"

### Rozlosování

* Náhodně přiřadit úkoly a 3 hráčům přidělit kartičku Impostora mezi 6 karet s úkoly => Impostor bude mít 5 kartiček úkolů a 1 kartičku "Jsi zvolen Impostorem." - Chci, aby vypadala stejně jako všechny ostatní
* 6 jednoduchých kartiček s úkoly
* Jednoduché tlačítko "Ukončit hru" - zobrazí modál "Opravdu chceš ukončit hru?"