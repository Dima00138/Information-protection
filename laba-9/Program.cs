using System;
using System.Text;

namespace lab10
{
    class Program
    {
        static void Main(string[] args)
        {
            string dictionary;
            string word;
            string message;
            string kodWord = "";
            int dictionaryLength;
            int wordLength;

            string inputMessage = "Тимошенко Дмитрий Валерьевич";
            string resultMessage = "";
            dictionaryLength = 8;
            wordLength = 8;
            word = inputMessage.Substring(0, wordLength);
            message = inputMessage.Substring(wordLength, inputMessage.Length - wordLength);

            int p = 0, q = 0;
            char c;
            dictionary = new string('0', dictionaryLength);

            while (word != "")
            {
                p = 0;
                q = 0;

                FindChars(dictionary, word, out p, out q, out c);

                SendChars(ref dictionary, ref word, q + 1);
                SendChars(ref word, ref message, q + 1);

                Minimize(ref dictionary, dictionaryLength);
                Minimize(ref word, wordLength);
                kodWord += p.ToString() + q.ToString() + c.ToString();
                Console.WriteLine("Словарь:             " + dictionary);
                Console.WriteLine("Слово(буфер данных): " + word);
                Console.WriteLine("Кодовое слово:       " + kodWord);
                Console.WriteLine("-------------------------------");

            }
            string str = "";
            dictionary = new string('0', dictionaryLength);

            for (int i = 0; i < kodWord.Length / 3; i++)
            {
                p = int.Parse(kodWord[i * 3].ToString());
                q = int.Parse(kodWord[i * 3 + 1].ToString());
                c = kodWord[i * 3 + 2];
                if (p == 0 && q == 0)
                {
                    resultMessage += c;
                    dictionary += c;
                }
                else
                {
                    str = dictionary.Substring((p - 1), q) + c;
                    resultMessage += str;
                    dictionary += str;
                }

                Minimize(ref dictionary, dictionaryLength);
                Console.WriteLine("Код:       " + p + " " + q + " " + c);
                Console.WriteLine("Результат: " + resultMessage);
                Console.WriteLine("Словарь:   " + dictionary);
                Console.WriteLine("-------------------------------");
            }

            void FindChars(string dict, string bufWord, out int indexInArray, out int Length, out char lastElement)
            {

                indexInArray = 0;
                Length = 0;
                lastElement = bufWord[0];

                while (dict.Contains(bufWord.Substring(0, (Length + 1))))
                {
                    indexInArray = dict.IndexOf(bufWord.Substring(0, (Length + 1))) + 1;
                    Length++;
                    if (bufWord.Length == Length)
                    {
                        lastElement = '|';
                        break;
                    }   
                    else
                        lastElement = bufWord[Length];
                }
            }

            void SendChars(ref string firstBuf, ref string secondByf, int charsCount)
            {
                charsCount = charsCount > secondByf.Length ? secondByf.Length : charsCount;
                if (charsCount > 0)
                {
                    firstBuf += secondByf.Substring(0, charsCount);
                    secondByf = secondByf.Substring(charsCount, secondByf.Length - charsCount);
                }
            }

            void Minimize(ref string byf, int size)
            {
                if (byf.Length > size)
                    byf = byf.Substring((byf.Length - size), byf.Length - (byf.Length - size));
            }
        }
    }
}
