const express = require('express');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Assuming frontend files are in a directory named 'public'

app.post('/compile', (req, res) => {
    const { code, language } = req.body;

    switch (language) {
        case 'python':
            // Compilation for Python code
            const pythonProcess = spawn('python', ['-c', code]);

            let pythonOutput = '';

            pythonProcess.stdout.on('data', (data) => {
                pythonOutput += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                pythonOutput += data.toString();
            });

            pythonProcess.on('close', (code) => {
                res.json({ output: pythonOutput, exitCode: code });
            });
            break;

        case 'c':
            // Compilation for C code
            const gccProcess = spawn('gcc', ['-o', 'compiled_code', '-x', 'c', '-'], {stdio: 'pipe'});

            let cError = '';

            gccProcess.stderr.on('data', (data) => {
                cError += data.toString();
            });

            gccProcess.on('close', (code) => {
                if (code === 0) {
                    // If compilation successful, execute the compiled code
                    const compiledProcess = spawn('./compiled_code', [], {stdio: 'pipe'});
                    let cOutput = '';

                    compiledProcess.stdout.on('data', (data) => {
                        cOutput += data.toString();
                    });

                    compiledProcess.stderr.on('data', (data) => {
                        cOutput += data.toString();
                    });

                    compiledProcess.on('close', () => {
                        res.json({ output: cOutput });
                    });
                } else {
                    // If compilation failed, return the error message
                    res.status(400).json({ error: cError });
                }
            });

            // Send the C code to the gcc process for compilation
            gccProcess.stdin.write(code);
            gccProcess.stdin.end();
            break;

        case 'cpp':
            // Compilation for C++ code
            const gppProcess = spawn('g++', ['-o', 'compiled_code', '-x', 'c++', '-'], {stdio: 'pipe'});

            let cppError = '';

            gppProcess.stderr.on('data', (data) => {
                cppError += data.toString();
            });

            gppProcess.on('close', (code) => {
                if (code === 0) {
                    // If compilation successful, execute the compiled code
                    const compiledProcess = spawn('./compiled_code', [], {stdio: 'pipe'});
                    let cppOutput = '';

                    compiledProcess.stdout.on('data', (data) => {
                        cppOutput += data.toString();
                    });

                    compiledProcess.stderr.on('data', (data) => {
                        cppOutput += data.toString();
                    });

                    compiledProcess.on('close', () => {
                        res.json({ output: cppOutput });
                    });
                } else {
                    // If compilation failed, return the error message
                    res.status(400).json({ error: cppError });
                }
            });

            // Send the C++ code to the g++ process for compilation
            gppProcess.stdin.write(code);
            gppProcess.stdin.end();
            break;

        case 'java':
            // Compilation for Java code
            const javacProcess = spawn('javac', ['Main.java'], {stdio: 'pipe'});

            let javaError = '';

            javacProcess.stderr.on('data', (data) => {
                javaError += data.toString();
            });

            javacProcess.on('close', (code) => {
                if (code === 0) {
                    // If compilation successful, execute the compiled code
                    const javaProcess = spawn('java', ['Main'], {stdio: 'pipe'});
                    let javaOutput = '';

                    javaProcess.stdout.on('data', (data) => {
                        javaOutput += data.toString();
                    });

                    javaProcess.stderr.on('data', (data) => {
                        javaOutput += data.toString();
                    });

                    javaProcess.on('close', () => {
                        res.json({ output: javaOutput });
                    });
                } else {
                    // If compilation failed, return the error message
                    res.status(400).json({ error: javaError });
                }
            });

            // Send the Java code to the javac process for compilation
            javacProcess.stdin.write(code);
            javacProcess.stdin.end();
            break;

        default:
            res.status(400).json({ error: 'Language not supported' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
