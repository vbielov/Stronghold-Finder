import { Vector } from "./Vector.js";

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

export class EnchantedBackground
{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    galacticAlphabetAtlas: HTMLImageElement;
    entities: Entity[];
    lastTime: number;

    constructor() {
        // Canvas
        this.canvas = document.getElementById('backgroundCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;

        // Image
        this.galacticAlphabetAtlas = new Image();
        const ref = this;
        this.galacticAlphabetAtlas.src = "./resources/galactic_alphabet.png";
        
        // Resizing
        addEventListener("resize", (event) => {
            ref.Resize();
        });
        this.Resize();

        // Entity
        this.entities = [];
    }

    public Update(): void {
        let deltaTime: number = Date.now() / 1000 - this.lastTime;
        this.lastTime = Date.now() / 1000;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // kill old entities
        this.entities = this.entities.filter((entity) => {
            return (entity.time -= deltaTime) >= 0 && entity.pos.y > 0
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
            this.entities[i].pos.y -= speed * deltaTime;
            
            this.DrawLetter(this.entities[i].index, this.entities[i].pos);
        }
        requestAnimationFrame(() => this.Update());
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
        this.canvas.width  = document.body.clientWidth * resolutionFactor;
        this.canvas.height = document.body.clientHeight * resolutionFactor;
    }
}

var background: EnchantedBackground = new EnchantedBackground();
requestAnimationFrame(() => background.Update());