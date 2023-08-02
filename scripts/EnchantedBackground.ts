import { Vector } from "./Vector.js";

export class EnchantedBackground
{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    galacticAlphabetAtlas: HTMLImageElement;
    atlasIsReady: boolean;
    entities: Entity[];
    deltaTime: number;

    constructor() {
        // Canvas
        this.canvas = document.getElementById('backgroundCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;

        // Image
        this.atlasIsReady = false;
        this.galacticAlphabetAtlas = new Image();
        const ref = this;
        this.galacticAlphabetAtlas.onload = function() {
            ref.atlasIsReady = true;
        }
        this.galacticAlphabetAtlas.src = "./galactic_alphabet.png";

        // Resizing
        addEventListener("resize", (event) => {
            ref.Resize();
        });
        this.Resize();

        // Entity
        this.entities = [];

        // Updating
        const FPS = 15;
        this.deltaTime = 1.0 / FPS;
        setInterval(() => this.Update(), this.deltaTime * 1000);
    }

    private Update(): void {
        if(!this.atlasIsReady)
            return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // kill old entities
        this.entities = this.entities.filter((entity) => {
            return (entity.time -= this.deltaTime) >= 0 && entity.pos.y > 0
        });

        // Spawn new entities if old died
        const minEntityCount = 100;
        while(this.entities.length < minEntityCount)
        {
            const lettersTotal = 10;
            const maxLifeTime = 20.0;
            this.entities.push(
                new Entity(
                    new Vector(
                        Math.random() * this.canvas.width, 
                        Math.random() * this.canvas.height
                    ),
                    Math.random() * maxLifeTime,
                    Math.round(Math.random() * (lettersTotal - 1))
                )
            );
        }
        
        // Update & Draw entities
        for(var i = 0; i < this.entities.length; i++)
        {
            const speed = 20;
            this.entities[i].pos.y -= speed * this.deltaTime;
            
            this.DrawLetter(this.entities[i].index, this.entities[i].pos);
        }

    }

    private DrawLetter(index: number, position: Vector): void {
        const uvGridSize = 16;
        const drawSize = new Vector(16, 16);
    
        var uvGridPos: Vector = new Vector(
            index % 4,
            Math.ceil(index / 4)
        );
        this.ctx.drawImage(
            this.galacticAlphabetAtlas, 
            uvGridPos.x * uvGridSize, 
            uvGridPos.y * uvGridSize, 
            uvGridSize - 1, uvGridSize - 1, 
            position.x, position.y, 
            drawSize.x, drawSize.y
        );
    }

    private Resize(): void {
        const resolutionFactor = 0.5;
        this.ctx.canvas.width  = window.innerWidth * resolutionFactor;
        this.ctx.canvas.height = window.innerHeight * resolutionFactor;
    }


}

class Entity
{
    pos: Vector;
    time: number;
    index: number;

    constructor(startPosition: Vector, lifeTime: number, letterIndex: number)
    {
        this.pos = startPosition;
        this.time = lifeTime;
        this.index = letterIndex;
    }
}