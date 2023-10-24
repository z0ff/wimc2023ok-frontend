import { useEffect, useRef } from "react";

const info = {
    seconds: 0,
    t: 0
};
const unit = 100;

function update(canvas: HTMLCanvasElement, color: string[]) {
    draw(canvas, color);

    // 共通の描画情報の更新
    info.seconds = info.seconds + 0.014;
    info.t = info.seconds * Math.PI;
    // 自身の再起呼び出し
    setTimeout(update, 1000 / 15, canvas, color);
}

/**
 * Draw animation function.
 *
 * This function draws one frame of the animation, waits 20ms, and then calls
 * itself again.
 */
function draw(canvas: HTMLCanvasElement, color: string[]) {
    // 対象のcanvasのコンテキストを取得
    const context = canvas.getContext("2d");
    // キャンバスの描画をクリア
    context?.clearRect(0, 0, canvas.width, canvas.height);

    //波の重なりを描画 drawWave(canvas, color[数字（波の数を0から数えて指定）], 透過, 波の幅のzoom,波の開始位置の遅れ )
    drawWave(canvas, color[0], 0.5, 3, 0);
    drawWave(canvas, color[1], 0.4, 2, 250);
    drawWave(canvas, color[2], 0.2, 1.6, 100);
}

/**
 * 波を描画
 * drawWave(色, 不透明度, 波の幅のzoom, 波の開始位置の遅れ)
 */
function drawWave(canvas: HTMLCanvasElement, color: string, alpha: number, zoom: number, delay: number) {
    const context = canvas.getContext("2d");
    context!.fillStyle = color; //塗りの色
    context!.globalAlpha = alpha;
    context?.beginPath(); //パスの開始
    drawSine(canvas, info.t / 0.5, zoom, delay);
    context?.lineTo(canvas.width + 10, canvas.height); //パスをCanvasの右下へ
    context?.lineTo(0, canvas.height); //パスをCanvasの左下へ
    context?.closePath(); //パスを閉じる
    context?.fill(); //塗りつぶす
}

/**
 * Function to draw sine
 *
 * The sine curve is drawn in 10px segments starting at the origin.
 * drawSine(時間, 波の幅のzoom, 波の開始位置の遅れ)
 */
function drawSine(canvas: HTMLCanvasElement, t: number, zoom: number, delay: number) {
    const xAxis = Math.floor(canvas.height / 2);
    const yAxis = 0;
    const context = canvas.getContext("2d");
    // Set the initial x and y, starting at 0,0 and translating to the origin on
    // the canvas.
    let x = t; //時間を横の位置とする
    let y = Math.sin(x) / zoom;
    context?.moveTo(yAxis, unit * y + xAxis); //スタート位置にパスを置く

    // Loop to draw segments (横幅の分、波を描画)
    for (let i = yAxis; i <= canvas.width + 10; i += 10) {
        x = t + (-yAxis + i) / unit / zoom;
        y = Math.sin(x - delay) / 3;
        context?.lineTo(i, unit * y + xAxis);
    }
}

export const BG = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        if (!canvasRef.current) {
            throw new Error("objectがnull");
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("context取得失敗");
        }

        //ctx.fillStyle = "#999999";
        //ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        info.seconds = 0;
        info.t = 0;
        const color = ["#666", "#ccc", "#eee"];
        update(canvas, color);
    }, []);
    return <canvas className="BG" ref={canvasRef} />;
};

export default BG;