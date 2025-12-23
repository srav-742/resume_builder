// Pre-built quiz questions to avoid API calls
// This eliminates the need to call the AI for generating quiz questions

export type QuizQuestion = {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
};

export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
    // HTML Questions
    "HTML": [
        {
            id: 1,
            question: "What does HTML stand for?",
            options: [
                "Hyper Text Markup Language",
                "High Tech Modern Language",
                "Home Tool Markup Language",
                "Hyperlinks and Text Markup Language"
            ],
            correctAnswer: 0
        },
        {
            id: 2,
            question: "Which HTML element is used for the largest heading?",
            options: ["<heading>", "<h6>", "<h1>", "<head>"],
            correctAnswer: 2
        },
        {
            id: 3,
            question: "What is the correct HTML element for inserting a line break?",
            options: ["<break>", "<lb>", "<br>", "<newline>"],
            correctAnswer: 2
        },
        {
            id: 4,
            question: "Which attribute specifies a unique id for an HTML element?",
            options: ["class", "id", "name", "key"],
            correctAnswer: 1
        },
        {
            id: 5,
            question: "What is the correct HTML for creating a hyperlink?",
            options: [
                "<a url='http://example.com'>",
                "<a href='http://example.com'>",
                "<link src='http://example.com'>",
                "<hyperlink>http://example.com</hyperlink>"
            ],
            correctAnswer: 1
        }
    ],

    // CSS Questions
    "CSS": [
        {
            id: 1,
            question: "What does CSS stand for?",
            options: [
                "Creative Style Sheets",
                "Cascading Style Sheets",
                "Computer Style Sheets",
                "Colorful Style Sheets"
            ],
            correctAnswer: 1
        },
        {
            id: 2,
            question: "Which property is used to change the background color?",
            options: ["bgcolor", "color", "background-color", "bg-color"],
            correctAnswer: 2
        },
        {
            id: 3,
            question: "How do you select an element with id 'header'?",
            options: [".header", "#header", "*header", "header"],
            correctAnswer: 1
        },
        {
            id: 4,
            question: "Which property is used to change the text color?",
            options: ["text-color", "font-color", "color", "text-style"],
            correctAnswer: 2
        },
        {
            id: 5,
            question: "What is the default value of the position property?",
            options: ["relative", "fixed", "absolute", "static"],
            correctAnswer: 3
        }
    ],

    // JavaScript Questions
    "JavaScript": [
        {
            id: 1,
            question: "Which company developed JavaScript?",
            options: ["Microsoft", "Netscape", "Google", "Mozilla"],
            correctAnswer: 1
        },
        {
            id: 2,
            question: "Which symbol is used for single line comments in JavaScript?",
            options: ["/*", "//", "#", "<!--"],
            correctAnswer: 1
        },
        {
            id: 3,
            question: "What is the correct way to declare a variable in ES6?",
            options: ["var x = 5;", "let x = 5;", "variable x = 5;", "v x = 5;"],
            correctAnswer: 1
        },
        {
            id: 4,
            question: "Which method is used to parse a string to an integer?",
            options: ["parseInt()", "parseInteger()", "toInt()", "Number()"],
            correctAnswer: 0
        },
        {
            id: 5,
            question: "What does '===' check in JavaScript?",
            options: [
                "Value only",
                "Type only",
                "Value and Type",
                "Reference only"
            ],
            correctAnswer: 2
        }
    ],

    // React Questions
    "React": [
        {
            id: 1,
            question: "What is React?",
            options: [
                "A server-side framework",
                "A JavaScript library for building user interfaces",
                "A CSS framework",
                "A database management system"
            ],
            correctAnswer: 1
        },
        {
            id: 2,
            question: "What is JSX?",
            options: [
                "A JavaScript framework",
                "A syntax extension for JavaScript",
                "A CSS preprocessor",
                "A build tool"
            ],
            correctAnswer: 1
        },
        {
            id: 3,
            question: "Which hook is used to manage state in functional components?",
            options: ["useEffect", "useState", "useContext", "useReducer"],
            correctAnswer: 1
        },
        {
            id: 4,
            question: "What is the virtual DOM?",
            options: [
                "A copy of the real DOM kept in memory",
                "A physical server",
                "A database",
                "A CSS framework"
            ],
            correctAnswer: 0
        },
        {
            id: 5,
            question: "How do you pass data from parent to child component?",
            options: ["state", "props", "context", "refs"],
            correctAnswer: 1
        }
    ],

    // TypeScript Questions
    "TypeScript": [
        {
            id: 1,
            question: "What is TypeScript?",
            options: [
                "A superset of JavaScript",
                "A replacement for JavaScript",
                "A CSS framework",
                "A database language"
            ],
            correctAnswer: 0
        },
        {
            id: 2,
            question: "What is the file extension for TypeScript files?",
            options: [".js", ".ts", ".tsx", ".javascript"],
            correctAnswer: 1
        },
        {
            id: 3,
            question: "Which keyword is used to define a type?",
            options: ["typedef", "type", "interface", "Both type and interface"],
            correctAnswer: 3
        },
        {
            id: 4,
            question: "What does the 'any' type represent?",
            options: [
                "A specific type",
                "No type checking",
                "Multiple types",
                "Undefined type"
            ],
            correctAnswer: 1
        },
        {
            id: 5,
            question: "How do you mark a parameter as optional?",
            options: [
                "parameter?",
                "optional parameter",
                "parameter!",
                "?parameter"
            ],
            correctAnswer: 0
        }
    ],

    // Node.js Questions
    "Node.js": [
        {
            id: 1,
            question: "What is Node.js?",
            options: [
                "A JavaScript runtime built on Chrome's V8 engine",
                "A web browser",
                "A database",
                "A CSS framework"
            ],
            correctAnswer: 0
        },
        {
            id: 2,
            question: "Which module is used to create a web server in Node.js?",
            options: ["fs", "http", "path", "url"],
            correctAnswer: 1
        },
        {
            id: 3,
            question: "What is NPM?",
            options: [
                "Node Package Manager",
                "New Programming Method",
                "Node Programming Model",
                "Network Package Manager"
            ],
            correctAnswer: 0
        },
        {
            id: 4,
            question: "Which keyword is used to import modules in Node.js?",
            options: ["include", "import", "require", "use"],
            correctAnswer: 2
        },
        {
            id: 5,
            question: "What is Express.js?",
            options: [
                "A database",
                "A Node.js web application framework",
                "A CSS framework",
                "A JavaScript library"
            ],
            correctAnswer: 1
        }
    ],

    // Next.js Questions
    "Next.js": [
        {
            id: 1,
            question: "What is Next.js?",
            options: [
                "A React framework",
                "A CSS framework",
                "A database",
                "A testing library"
            ],
            correctAnswer: 0
        },
        {
            id: 2,
            question: "What does SSR stand for in Next.js?",
            options: [
                "Static Site Rendering",
                "Server-Side Rendering",
                "Simple Server Response",
                "Secure Server Routing"
            ],
            correctAnswer: 1
        },
        {
            id: 3,
            question: "Which directory is used for routing in Next.js 13+?",
            options: ["pages", "routes", "app", "src"],
            correctAnswer: 2
        },
        {
            id: 4,
            question: "What is the purpose of getStaticProps?",
            options: [
                "Fetch data at runtime",
                "Fetch data at build time",
                "Handle API routes",
                "Manage state"
            ],
            correctAnswer: 1
        },
        {
            id: 5,
            question: "Which file is used for API routes in Next.js?",
            options: [
                "Any file in /api directory",
                "server.js",
                "api.js",
                "routes.js"
            ],
            correctAnswer: 0
        }
    ],

    // Python Questions
    "Python": [
        {
            id: 1,
            question: "What is Python?",
            options: [
                "A compiled language",
                "An interpreted high-level programming language",
                "A database",
                "A web browser"
            ],
            correctAnswer: 1
        },
        {
            id: 2,
            question: "Which keyword is used to define a function in Python?",
            options: ["function", "def", "func", "define"],
            correctAnswer: 1
        },
        {
            id: 3,
            question: "What is the correct file extension for Python files?",
            options: [".pt", ".pyt", ".py", ".python"],
            correctAnswer: 2
        },
        {
            id: 4,
            question: "Which operator is used for exponentiation in Python?",
            options: ["^", "**", "exp", "pow"],
            correctAnswer: 1
        },
        {
            id: 5,
            question: "What does PEP stand for?",
            options: [
                "Python Enhancement Proposal",
                "Python Execution Protocol",
                "Python Extension Package",
                "Python Environment Path"
            ],
            correctAnswer: 0
        }
    ],

    // MongoDB Questions
    "MongoDB": [
        {
            id: 1,
            question: "What type of database is MongoDB?",
            options: [
                "Relational database",
                "NoSQL document database",
                "Graph database",
                "Key-value store"
            ],
            correctAnswer: 1
        },
        {
            id: 2,
            question: "What is a collection in MongoDB?",
            options: [
                "A table",
                "A group of documents",
                "A field",
                "A relationship"
            ],
            correctAnswer: 1
        },
        {
            id: 3,
            question: "Which command is used to insert a document?",
            options: ["add()", "insert()", "insertOne()", "create()"],
            correctAnswer: 2
        },
        {
            id: 4,
            question: "What is the default port for MongoDB?",
            options: ["3306", "5432", "27017", "8080"],
            correctAnswer: 2
        },
        {
            id: 5,
            question: "What does BSON stand for?",
            options: [
                "Binary JSON",
                "Basic JSON",
                "Big JSON",
                "Better JSON"
            ],
            correctAnswer: 0
        }
    ],

    // Express.js Questions
    "Express.js": [
        {
            id: 1,
            question: "What is Express.js?",
            options: [
                "A database",
                "A minimal Node.js web application framework",
                "A CSS framework",
                "A testing library"
            ],
            correctAnswer: 1
        },
        {
            id: 2,
            question: "Which method is used to define a GET route?",
            options: ["app.route()", "app.get()", "app.http()", "app.request()"],
            correctAnswer: 1
        },
        {
            id: 3,
            question: "What is middleware in Express?",
            options: [
                "A database connector",
                "Functions that execute during the request-response cycle",
                "A routing system",
                "A template engine"
            ],
            correctAnswer: 1
        },
        {
            id: 4,
            question: "How do you send JSON response in Express?",
            options: [
                "res.sendJSON()",
                "res.json()",
                "res.send()",
                "res.write()"
            ],
            correctAnswer: 1
        },
        {
            id: 5,
            question: "What is req.params used for?",
            options: [
                "Query strings",
                "Request body",
                "Route parameters",
                "Headers"
            ],
            correctAnswer: 2
        }
    ]
};

// Get random questions for a skill
export function getQuizQuestions(skill: string, count: number = 5): QuizQuestion[] {
    const questions = QUIZ_QUESTIONS[skill];
    if (!questions) {
        return [];
    }

    // If we have exactly the count needed, return all
    if (questions.length === count) {
        return questions;
    }

    // If we have more, shuffle and return subset
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Get all available skills
export function getAvailableQuizSkills(): string[] {
    return Object.keys(QUIZ_QUESTIONS);
}
