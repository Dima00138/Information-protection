using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace lab11
{
    public class Program
    {

        static void Main(string[] args)
        {
            {
                string word = "сорокадневный";
                int wordLength = word.Length;
                Compressor wordCompressor = new Compressor();

                wordCompressor.Build(word);
                Console.WriteLine("Intervals:");
                foreach (var i in wordCompressor.Nodes)
                {
                    Console.WriteLine($"p({i.Symbol}) = {i.High - i.Low}\n");
                }
                foreach (var i in wordCompressor.Nodes)
                {
                    Console.WriteLine($"{i.Symbol}  {i.Low} - {i.High}\n");
                }

                var compressResult = wordCompressor.Compress(word);
                Console.WriteLine("Compress info:");
                Console.WriteLine(InfoString.Sb.ToString());
                Console.WriteLine($"Result: {compressResult}\n");

                var decompressResult = wordCompressor.Decompress(compressResult, wordLength, wordLength / 2 + 1);
                Console.WriteLine("Decompress info:");
                Console.WriteLine(InfoString.Sb.ToString());
                Console.WriteLine($"Result: {decompressResult}");
            }

            Console.WriteLine("\n\n");

            {
                string word = "сорокадневныйтелегаммааппарат";
                int wordLength = word.Length;
                Compressor wordCompressor = new Compressor();

                wordCompressor.Build(word);
                Console.WriteLine("Intervals:");
                foreach (var i in wordCompressor.Nodes)
                {
                    Console.WriteLine($"p({i.Symbol}) = {i.High - i.Low}\n");
                }
                foreach (var i in wordCompressor.Nodes)
                {
                    Console.WriteLine($"{i.Symbol}  {i.Low} - {i.High}\n");
                }

                var compressResult = wordCompressor.Compress(word);
                Console.WriteLine("Compress info:");
                Console.WriteLine(InfoString.Sb.ToString());
                Console.WriteLine($"Result: {compressResult}\n");

                var decompressResult = wordCompressor.Decompress(compressResult, wordLength, wordLength / 2 + 1);
                Console.WriteLine("Decompress info:");
                Console.WriteLine(InfoString.Sb.ToString());
                Console.WriteLine($"Result: {decompressResult}");
            }
        }
    }
    public class Compressor
    {
        public List<Node> Nodes { get; set; }
        public Dictionary<char, decimal> Frequencies { get; set; }
        public Node ResultNode { get; set; }

        public void Build(string source)
        {
            Nodes = new List<Node>();
            decimal inc = 1 / (decimal)source.Length;
            Frequencies = new Dictionary<char, decimal>();
            for (int i = 0; i < source.Length; i++)
            {
                if (!Frequencies.ContainsKey(source[i]))
                {
                    Frequencies.Add(source[i], 0);
                }
                Frequencies[source[i]] += inc;
            }
            Frequencies = Frequencies.OrderBy(x => x.Value).ToDictionary(x => x.Key, y => y.Value);
            decimal low = 0;
            foreach (var item in Frequencies)
            {
                Nodes.Add(new Node { Symbol = item.Key, Low = Math.Round(low, 5), High = Math.Round(low + item.Value, 5) });
                low += item.Value;
            }
        }

        public decimal Compress(string source)
        {
            InfoString.Sb = new StringBuilder();
            ResultNode = new Node { Symbol = '*', High = 1, Low = 0 };
            foreach (var item in source)
            {
                decimal oldHigh = ResultNode.High;
                decimal oldLow = ResultNode.Low;
                InfoString.Sb.Append(ResultNode.ToString()).Append(Environment.NewLine);
                ResultNode.Symbol = '*';
                ResultNode.High = oldLow + (oldHigh - oldLow) * Nodes.Find(x => x.Symbol == item).High;
                ResultNode.Low = oldLow + (oldHigh - oldLow) * Nodes.Find(x => x.Symbol == item).Low;
            }
            InfoString.Sb.Append(ResultNode.ToString()).Append(Environment.NewLine);
            return ResultNode.Low;
        }

        public string Decompress(decimal compress, int leng, int t)
        {
            StringBuilder sb = new StringBuilder();
            InfoString.Sb = new StringBuilder();
            for (int i = 0; i < leng; i++)
            {
                char symbol = Nodes.Find(x => Math.Round(compress, t) >= x.Low && Math.Round(compress, t) < x.High).Symbol;
                InfoString.Sb.Append(compress.ToString() + $"\t-- {symbol}").Append(Environment.NewLine);
                sb.Append(symbol);
                Node tempNode = Nodes.Find(x => x.Symbol == symbol);
                compress = (compress - tempNode.Low) / (tempNode.High - tempNode.Low);
            }
            return sb.ToString();
        }
    }

    public class Node
    {
        public char Symbol { get; set; }
        public decimal High { get; set; }
        public decimal Low { get; set; }

        public override string ToString()
        {
            return string.Format("Low: {0} | High: {1}", Low.ToString(), High.ToString());
        }
    }

    public class InfoString
    {
        public static StringBuilder Sb { get; set; }
    }
}

