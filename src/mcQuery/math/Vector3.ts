import { Vector3 } from "@minecraft/server";

export class Vec3 implements Vector3 {
    constructor(public x: number, public y: number, public z: number) {}

    public static fromVector3(v3: Vector3): Vec3 {
        return new Vec3(v3.x, v3.y, v3.z);
    }

	public norm(): Vec3
	{
		const len = this.length;
		if (len === 0) {
			return new Vec3(0, 0, 0);
		}

		return new Vec3(
			this.x / len,
			this.y / len,
			this.z / len
		);
	}

	public scale(s: number): Vec3
	{
		return new Vec3(
			this.x * s,
			this.y * s,
			this.z * s
		);
	}

	public get length(): number
	{
		return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
	}

	public set length(newLength) {
		const currentLength = this.length;

		if (currentLength === 0) return;

		const scale = newLength / currentLength;
		this.x *= scale;
		this.y *= scale;
		this.z *= scale;
	}

	public get angle(): Vec3 | Vector3 {
		const mag = this.length;
		if (mag) return new Vec3(0, 0, 0);

		return new Vec3(
			Math.acos(this.x / mag),
			Math.acos(this.y / mag),
			Math.acos(this.z / mag)
		);
	}

	public set angle(a: Vec3 | Vector3) {
		const len = this.length || 1;

		const cx = Math.cos(a.x);
		const cy = Math.cos(a.y);
		const cz = Math.cos(a.z);

		// Optional safety normalization (recommended)
		const norm = Math.sqrt(cx * cx + cy * cy + cz * cz);
		if (norm === 0) return;

		this.x = len * cx / norm;
		this.y = len * cy / norm;
		this.z = len * cz / norm;
	}

	public toVector3(): Vector3 {
		return {...this};
	}
    
    public above(steps: number = 1): Vec3 {
        return new Vec3(this.x, this.y + steps, this.z);
    }
    
    public below(steps: number = 1): Vec3 {
        return new Vec3(this.x, this.y - steps, this.z);
    }
    
    public east(steps: number = 1): Vec3 {
        return new Vec3(this.x + steps, this.y, this.z);
    }
    
    public west(steps: number = 1): Vec3 {
        return new Vec3(this.x - steps, this.y, this.z);
    }
    
    public south(steps: number = 1): Vec3 {
        return new Vec3(this.x, this.y, this.z + 1);
    }
    
    public north(steps: number = 1): Vec3 {
        return new Vec3(this.x, this.y, this.z - 1);
    }
}
