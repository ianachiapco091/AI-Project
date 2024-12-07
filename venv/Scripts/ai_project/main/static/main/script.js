document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileElem');
    const uploadButton = document.getElementById('uploadBtn');
    const fileInfo = document.getElementById('file-info');
    const preview = document.getElementById('preview');
    const message = document.getElementById('message');
    const scanButton = document.getElementById('scanBtn');
    const homeButton = document.getElementById('homeBtn');

    // Enable the upload button when a file is selected
    fileInput.addEventListener('change', function () {
        const files = fileInput.files;
        if (files.length > 0) {
            uploadButton.disabled = false;
            fileInfo.innerHTML = `Selected file: ${files[0].name}`;
            preview.innerHTML = ''; // Clear previous previews

            // Preview the selected file (if it's an image)
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '200px'; // Set a max width for the preview
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        } else {
            uploadButton.disabled = true;
            fileInfo.innerHTML = '';
            preview.innerHTML = '';
        }
    });

    // Handle the upload button click
    uploadButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default form submission
        const files = fileInput.files;
        if (files.length > 0) {
            const formData = new FormData();
            formData.append('file', files[0]); // Append the file to the FormData object

            message.innerHTML = 'Uploading...';

            // Send the file to the server using fetch
            fetch('/upload/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken') // Include CSRF token
                }
            })
            .then(response => response.json())
            .then(data => {
                message.innerHTML = data.message; // Display the server response message
                fileInfo.innerHTML = 'Uploaded file: ' + data.filename; // Display the uploaded file name
                // Reset the input and UI
                fileInput.value = '';
                uploadButton.disabled = true;
                preview.innerHTML = '';
            })
            .catch(error => {
                console.error('Error:', error);
                message.innerHTML = 'Upload failed.';
            });
        }
    });

    // Function to get CSRF token from cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    scanButton.addEventListener('click', function () {
        window.location.href = '/main/scan.html';
    });

    homeButton.addEventListener('click', function(){
        window.location.href = '/main/upload.html';
    });
});