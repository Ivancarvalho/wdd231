const courses = [
    {
        code: 'CSE 110',
        name: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and functions).',
        technology: [ 'Python' ],
        completed: true
    },
    {
        code: 'WDD 130',
        name: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually building a complete web site.',
        technology: [ 'HTML', 'CSS' ],
        completed: true
    },
    {
        code: 'CSE 111',
        name: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students are taught more of programming, focusing on functions and testing. The course teaches how to write code that is more modular and easier to test.',
        technology: [ 'Python' ],
        completed: true
    },
    {
        code: 'CSE 210',
        name: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the concepts of classes and objects. It will introduce encapsulation, inheritance, and polymorphism.',
        technology: [ 'C#' ],
        completed: false
    },
    {
        code: 'WDD 131',
        name: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior web design courses and teaches students how to use JavaScript and CSS to build a dynamic web site.',
        technology: [ 'HTML', 'CSS', 'JavaScript' ],
        completed: true
    },
    {
        code: 'WDD 231',
        name: 'Web Frontend Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior web design courses and teaches students how to use JavaScript, CSS, and HTML to build a responsive web site.',
        technology: [ 'HTML', 'CSS', 'JavaScript' ],
        completed: false
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const coursesContainer = document.querySelector("#courses-container");
    const totalCreditsP = document.querySelector("#total-credits");
    const allBtn = document.querySelector("#all-btn");
    const wddBtn = document.querySelector("#wdd-btn");
    const cseBtn = document.querySelector("#cse-btn");

    function displayCourses(filteredCourses) {
        if (!coursesContainer) return;
        coursesContainer.innerHTML = "";

        filteredCourses.forEach(course => {
            const card = document.createElement("div");
            card.classList.add("course-card");
            if (course.completed) {
                card.classList.add("completed");
            }
            card.textContent = `${course.code} (${course.credits} Créditos)`;
            coursesContainer.appendChild(card);
        });

        // Calcula e exibe o total de créditos usando reduce
        const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
        if (totalCreditsP) {
            totalCreditsP.textContent = `Número total de créditos necessários: ${totalCredits}`;
        }
    }

    // Eventos de clique para os filtros
    if (allBtn) {
        allBtn.addEventListener("click", () => displayCourses(courses));
    }
    if (wddBtn) {
        wddBtn.addEventListener("click", () => {
            const wddCourses = courses.filter(course => course.code.startsWith("WDD"));
            displayCourses(wddCourses);
        });
    }
    if (cseBtn) {
        cseBtn.addEventListener("click", () => {
            const cseCourses = courses.filter(course => course.code.startsWith("CSE"));
            displayCourses(cseCourses);
        });
    }

    // Exibição inicial (todos os cursos)
    displayCourses(courses);
});