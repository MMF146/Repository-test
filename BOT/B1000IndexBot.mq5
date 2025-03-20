int OnInit()
{
   // Configurar timeframes
   if(!SymbolSelect(Symbol_Name, true) || 
      SymbolInfoInteger(Symbol_Name, SYMBOL_SELECT) == 0)
   {
      Print("Error: El símbolo ", Symbol_Name, " no está disponible!");
      return(INIT_FAILED);
   }
   
   // ... existing code ...
}

void IdentifyExternalLiquidity()
{
   // Reiniciar contadores
   liquiditySupportCount = 0;
   liquidityResistanceCount = 0;
   
   // En MQL5 podemos intentar usar MarketBookGet si el broker lo permite
   MqlBookInfo book[];
   bool bookAvailable = MarketBookGet(Symbol_Name, book);
   
   // Si el libro de órdenes está disponible, usarlo
   if(bookAvailable && ArraySize(book) > 0)
   {
      // Procesar el libro de órdenes para encontrar niveles de liquidez
      // ... código omitido para brevedad
   }
   
   // Si no podemos obtener el libro o como método alternativo,
   // encontramos niveles recientes de soporte/resistencia
   
   // Líneas 211-212: Corregir condición de mínimo local
   // Encontrar niveles de soporte basados en mínimos recientes
   for(int i = 5; i < OB_Lookback - 5; i++)
   {
      bool isSupport = true;
      
      // Verificar si es un mínimo local
      for(int j = i - 5; j <= i + 5; j++)
      {
         if(j == i) continue;
         if(j >= 0 && j < OB_Lookback && lowH1[i] >= lowH1[j])  // Cambio de > a >=
         {
            isSupport = false;
            break;
         }
      }
      
      // Línea 222: Añadir condición para evitar duplicados
      if(isSupport && liquiditySupportCount < 20)
      {
         // Verificar si este nivel ya existe (evitar duplicados)
         bool isDuplicate = false;
         for(int k = 0; k < liquiditySupportCount; k++)
         {
            if(MathAbs(lowH1[i] - liquiditySupportLevels[k]) < Point() * 5)
            {
               isDuplicate = true;
               break;
            }
         }
         
         if(!isDuplicate)
         {
            liquiditySupportLevels[liquiditySupportCount] = lowH1[i];
            liquiditySupportCount++;
         }
      }
   }
   
   // Líneas 228-229: Corregir condición de máximo local
   // Encontrar niveles de resistencia basados en máximos recientes
   for(int i = 5; i < OB_Lookback - 5; i++)
   {
      bool isResistance = true;
      
      // Verificar si es un máximo local
      for(int j = i - 5; j <= i + 5; j++)
      {
         if(j == i) continue;
         if(j >= 0 && j < OB_Lookback && highH1[i] <= highH1[j])  // Cambio de < a <=
         {
            isResistance = false;
            break;
         }
      }
      
      // Línea 239: Añadir condición para evitar duplicados
      if(isResistance && liquidityResistanceCount < 20)
      {
         // Verificar si este nivel ya existe (evitar duplicados)
         bool isDuplicate = false;
         for(int k = 0; k < liquidityResistanceCount; k++)
         {
            if(MathAbs(highH1[i] - liquidityResistanceLevels[k]) < Point() * 5)
            {
               isDuplicate = true;
               break;
            }
         }
         
         if(!isDuplicate)
         {
            liquidityResistanceLevels[liquidityResistanceCount] = highH1[i];
            liquidityResistanceCount++;
         }
      }
   }
   
   // Líneas 245-246: Corregir método de ordenamiento (bubble sort)
   // Ordenar los niveles (bubble sort mejorado)
   // Para soportes (descendente)
   if(liquiditySupportCount > 1)
   {
      for(int i = 0; i < liquiditySupportCount - 1; i++)
      {
         for(int j = 0; j < liquiditySupportCount - i - 1; j++)
         {
            if(liquiditySupportLevels[j] < liquiditySupportLevels[j + 1])  // Comparación correcta
            {
               double temp = liquiditySupportLevels[j];
               liquiditySupportLevels[j] = liquiditySupportLevels[j + 1];
               liquiditySupportLevels[j + 1] = temp;
            }
         }
      }
   }
   
   // Para resistencias (ascendente)
   if(liquidityResistanceCount > 1)
   {
      for(int i = 0; i < liquidityResistanceCount - 1; i++)
      {
         for(int j = 0; j < liquidityResistanceCount - i - 1; j++)
         {
            if(liquidityResistanceLevels[j] > liquidityResistanceLevels[j + 1])  // Comparación correcta
            {
               double temp = liquidityResistanceLevels[j];
               liquidityResistanceLevels[j] = liquidityResistanceLevels[j + 1];
               liquidityResistanceLevels[j + 1] = temp;
            }
         }
      }
   }
} 
