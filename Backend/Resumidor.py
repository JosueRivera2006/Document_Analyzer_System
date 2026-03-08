# Ejecutar pip install sumy nltk
# Ejecutar pip install langdetect
# Ejecutar pip install deep-translator
# Ejecutar pip install wordcloud
# Ejecutar pip install stopwordsiso
import nltk
import re
import os
# Descargas necesarias, se pueden quitar del script, si se ejecuto solamente una vez
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')

from langdetect import detect
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from deep_translator import GoogleTranslator
from wordcloud import WordCloud
from nltk.corpus import stopwords

# Crear el resumidor
resumidor = LexRankSummarizer()

# Nombre del archivo
archivo = "ejemplo.txt" 

# Leer el texto desde el archivo
with open(archivo, encoding="utf-8") as f:
    texto = f.read()

# Eliminar emojis usando regex
texto = re.sub(r"[^\w\s.,;:¡!¿?áéíóúüñÁÉÍÓÚÜÑ()-]", "", texto)

# Detectar idioma
idioma_detectado = detect(texto)
# Mapeo de idioma a los tokenizadores que acepta Sumy
mapa_idiomas = {
    'es': 'spanish',
    'en': 'english',
    'fr': 'french',
    'de': 'german',
    'pt': 'portuguese',
}
tokenizer_idioma = mapa_idiomas.get(idioma_detectado, 'english')  # inglés por defecto
stopwords_idioma = set(stopwords.words(mapa_idiomas.get(idioma_detectado, 'english'))) # palabras que no se toman en cuenta en la nube de palabras respecto a idioma
# Contar palabras del documento original
palabras_originales = len(texto.split())

# Traducir "Resumen de:" al idioma detectado
traduccion = GoogleTranslator(source='auto', target=idioma_detectado).translate("Resumen de")

# Crear el título
titulo = f"{traduccion} {os.path.splitext(os.path.basename(archivo))[0]}"

# Procesar el documento completo
parser = PlaintextParser.from_string(texto, Tokenizer(tokenizer_idioma))

# Generar resumen: seleccionar un número de oraciones
num_oraciones = max(5, len(parser.document.sentences) // 8)
resumen = resumidor(parser.document, num_oraciones)

# Convertir resumen a texto estructurado en párrafos
oraciones_resumen = [str(oracion) for oracion in resumen]

parrafos = []
for i in range(0, len(oraciones_resumen), 3):  # 3 oraciones por párrafo
    parrafo = " ".join(oraciones_resumen[i:i+3])
    parrafos.append(parrafo)

resumen_final = "\n\n".join(parrafos)

# Contar palabras del resumen
palabras_resumen = len(resumen_final.split())

# Guardar el resumen en un archivo
with open("resumen.txt", "w", encoding="utf-8") as f:
    f.write(titulo + "\n\n")
    f.write(resumen_final)

# Crear objeto WordCloud sin generar imagen
wordcloud = WordCloud(width=800, height=400, background_color="white", stopwords=stopwords_idioma).generate(resumen_final)

# Obtener las palabras y sus frecuencias como diccionario
frecuencias = wordcloud.words_

# Convertir a lista de palabras más frecuentes (Top 15)
palabras_mas_comunes = list(frecuencias.keys())[:15]

print("Resumen guardado en 'resumen.txt'")
print("Idioma detectado:", idioma_detectado)
print("Palabras del documento original:", palabras_originales)
print("Palabras del resumen:", palabras_resumen)
print("Nube de palabras:", palabras_mas_comunes)