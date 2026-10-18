export function DogFace() {
    return (
        <svg viewBox="0 0 200 200" role="presentation" focusable="false">
            <ellipse cx="40" cy="92" rx="22" ry="44" fill="#8A5A3C" transform="rotate(10 40 92)" />
            <ellipse cx="160" cy="92" rx="22" ry="44" fill="#8A5A3C" transform="rotate(-10 160 92)" />
            <ellipse cx="100" cy="102" rx="58" ry="62" fill="#D9A06B" />
            <ellipse cx="100" cy="132" rx="31" ry="25" fill="#F6E3C8" />
            <circle cx="78" cy="92" r="6" fill="#16272B" />
            <circle cx="122" cy="92" r="6" fill="#16272B" />
            <circle cx="80" cy="90" r="2" fill="#fff" />
            <circle cx="124" cy="90" r="2" fill="#fff" />
            <ellipse cx="100" cy="116" rx="10" ry="7" fill="#16272B" />
            <path
                d="M100 123v8M100 131q-10 8-19 0M100 131q10 8 19 0"
                fill="none"
                stroke="#16272B"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <ellipse cx="100" cy="145" rx="8" ry="10" fill="#E8768A" />
            <path d="M52 188q48-34 96 0v12H52z" fill="#F7B84B" />
        </svg>
    );
}
 
export function CatFace() {
    return (
        <svg viewBox="0 0 200 200" role="presentation" focusable="false">
            <polygon points="46,76 56,16 100,52" fill="#8F95B2" />
            <polygon points="154,76 144,16 100,52" fill="#8F95B2" />
            <polygon points="58,60 62,34 84,52" fill="#F2A7B8" />
            <polygon points="142,60 138,34 116,52" fill="#F2A7B8" />
            <ellipse cx="100" cy="108" rx="62" ry="56" fill="#B9BED4" />
            <ellipse cx="76" cy="100" rx="7" ry="10" fill="#16272B" />
            <ellipse cx="124" cy="100" rx="7" ry="10" fill="#16272B" />
            <circle cx="78" cy="96" r="2.4" fill="#fff" />
            <circle cx="126" cy="96" r="2.4" fill="#fff" />
            <polygon points="93,120 107,120 100,129" fill="#F2A7B8" />
            <path
                d="M100 129v6M100 135q-9 8-17 1M100 135q9 8 17 1"
                fill="none"
                stroke="#16272B"
                strokeWidth="2.6"
                strokeLinecap="round"
            />
            <g stroke="#16272B" strokeWidth="2" strokeLinecap="round" opacity=".55">
                <path d="M60 126l-30-6M60 134l-30 4M140 126l30-6M140 134l30 4" />
            </g>
            <path d="M52 190q48-34 96 0v10H52z" fill="#732a81" />
        </svg>
    );
}
 
//*
// Each tag is one shape. <circle> draws a circle and <ellipse> draws an oval. <polygon> draws a shape from a list of corner points, which is how the cat’s pointed ears are made. <path> draws free-form lines and curves, which is how the mouth is made. The numbers are positions and sizes on a 200 by 200 canvas, and fill is the color. I stacked these shapes to build a dog face and a cat face.
 
// Why I made them React components: DogFace and CatFace are small reusable components. I use them in Login.jsx like <DogFace />, the same way I would use any other component.
 
// The attribute name rule: In JSX, attributes with a hyphen are written in camelCase, so stroke-width becomes strokeWidth. This is a general JSX rule. It is the same reason you write className instead of class, which you already do in your code.
 
// A short version you can say: “I drew the pet faces as SVG, which is an image made of shapes in code, and wrapped them in React components so I can reuse them.”
 
// If you don’t want to defend the SVG code in an interview, there is an easier option. Your project already uses react-icons, and it has dog and cat icons (FaDog and FaCat). You would import them the same way you import FaPaw, and then you could explain the whole panel without any SVG. They would look simpler and flatter than my drawn faces. If you want that version, I can change the files.*//