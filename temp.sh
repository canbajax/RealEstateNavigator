#!/bin/bash

# Detaylı bilgi yerine bilgi yaz
sed -i "s/<span>Detaylı Bilgi<\/span>/<span>Bilgi<\/span>/g" client/src/pages/Home.tsx

# İcon ve arrow kaldır
sed -i "s/                  <svg xmlns=\"http:\/\/www.w3.org\/2000\/svg\" className=\"h-4 w-4 ml-1\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                    <path fillRule=\"evenodd\" d=\"M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z\" clipRule=\"evenodd\" \/>\n                  <\/svg>//g" client/src/pages/Home.tsx

# Stil değiştir
sed -i "s/className=\"inline-flex items-center text-\[#3498DB\] font-medium hover:text-\[#5DADE2\] transition-colors\"/className=\"text-\[#3498DB\] font-medium hover:text-\[#5DADE2\] transition-colors\"/g" client/src/pages/Home.tsx