import Head from "next/head";
import { useRef, useState } from "react";

const SITE_NAME = "100 Pixel Art";
const DESCRIPTION = "you can make pixel art only 100 pixel.";
const SITE_URL = "https://100pixelart.nabettu.com";
const OG_IMAGE = SITE_URL + "/ogp.png";
const SHARE_TEXT = "#100pixelart " + SITE_URL;
const PALLET = [
  "⬜",
  "🟥",
  "🟧",
  "🟨",
  "🟩",
  "🟦",
  "🟪",
  "🟫",
  "⬛",
  "🏻",
  "🏼",
  "🏽",
  "🏾",
  "🏿",
];
const initText = () =>
  Array(10)
    .fill("⬜")
    .map(i => new Array(10).fill(i));

export default function Home() {
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(1);
  // const [debugText, setDebugText] = useState<string>("");
  const [tweetText, setTweetText] = useState<string>("");
  const [tweetUrl, setTweetUrl] = useState<string>("");

  const canvasRef = useRef(null);
  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);

  const [canvasText, setCanvasText] = useState<string[][]>(initText());
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const paint = (rowIndex, colIndex) => {
    // console.log(rowIndex, colIndex, PALLET[selectedColorIndex]);
    const newCanvas = [...canvasText];
    newCanvas[rowIndex][colIndex] = PALLET[selectedColorIndex];
    setCanvasText(newCanvas);
  };
  const calcPosition = (client, offSet) =>
    Math.min(Math.max(Math.ceil((client - offSet) / 30) - 1, 0), 9);
  const reset = () => {
    setCanvasText(initText());
  };
  const back = () => {
    setTweetText("");
  };
  const finish = () => {
    const dotText = canvasText.map(row => row.join(""));
    setTweetText(dotText.join("\n") + "\n" + SHARE_TEXT);
    setTweetUrl(
      `https://twitter.com/share?text=${
        dotText.join(escape("\n")) + escape("\n" + SHARE_TEXT)
      }`
    );
  };
  // useEffect(() => {
  //   setTimeout(() => setDebugText(""), 100);
  // }, [debugText]);
  return (
    <>
      <Head>
        <title>{SITE_NAME}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:title" content={SITE_NAME} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="thumbnail" content={OG_IMAGE} />
        <meta property="og:image:width" content="256" />
        <meta property="og:image:height" content="256" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
      </Head>

      <main>
        <h1>{SITE_NAME}</h1>
        {!tweetText && (
          <>
            <div className="canvas" ref={canvasRef}>
              {canvasText.map((row, rowIndex) => (
                <div
                  className="canvasRow"
                  key={rowIndex}
                  onMouseUp={() => setMouseDown(false)}
                  onMouseDown={() => setMouseDown(true)}
                  onMouseOut={() => setMouseDown(false)}
                  onTouchStart={() => {
                    // setDebugText("touchstart");
                    setMouseDown(true);
                  }}
                  onTouchEnd={() => setMouseDown(false)}
                >
                  {row.map((text, colIndex) => (
                    <span
                      key={colIndex}
                      className="pixel"
                      onMouseMove={() => mouseDown && paint(rowIndex, colIndex)}
                      onMouseOut={e => e.stopPropagation()}
                      onTouchMove={e => {
                        // console.log(
                        //   canvasRef.current.offsetTop,
                        //   canvasRef.current.offsetLeft
                        // );

                        // setTop(e.targetTouches[0].clientY);
                        // setLeft(e.targetTouches[0].clientX);
                        const row = calcPosition(
                          e.targetTouches?.[0]?.clientY,
                          canvasRef?.current?.offsetTop
                        );
                        const col = calcPosition(
                          e.targetTouches?.[0]?.clientX,
                          canvasRef?.current?.offsetLeft
                        );
                        paint(row, col);
                        e.stopPropagation();
                      }}
                      // onTouchCancel={e => e.stopPropagation()}
                      onClick={() => paint(rowIndex, colIndex)}
                    >
                      {text}
                    </span>
                  ))}
                </div>
              ))}
              {/* <div className="pointer" style={{ top, left }} /> */}
            </div>
            <div className="pallet">
              {PALLET.map((text, index) => (
                <button
                  className="palletBtn"
                  onClick={() => {
                    setSelectedColorIndex(index);
                  }}
                  data-selected={selectedColorIndex == index}
                  key={index}
                >
                  {text}
                </button>
              ))}
            </div>
          </>
        )}
        <div className="buttons">
          {!tweetText ? (
            <>
              <button onClick={finish}>Finish</button>
              <button onClick={reset}>🗑</button>
            </>
          ) : (
            <button onClick={back}>back</button>
          )}
        </div>
        {tweetText && (
          <div className="share">
            <textarea value={tweetText}></textarea>
            <a
              href={tweetUrl}
              className="tweetBtn"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              <svg viewBox="0 0 512 512">
                <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
              </svg>
              Tweet
            </a>
          </div>
        )}
      </main>
      <footer>
        {/* {debugText} */}
        <p>
          created by{" "}
          <a
            href="https://twitter.com/nabettu"
            target="_blank"
            rel="noopener noreferrer"
          >
            @nabettu
          </a>
        </p>
      </footer>
    </>
  );
}
