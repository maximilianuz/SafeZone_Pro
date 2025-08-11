document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const elements = {
        preset: document.getElementById('preset'),
        canvasWidth: document.getElementById('canvas-width'),
        canvasHeight: document.getElementById('canvas-height'),
        marginTop: document.getElementById('margin-top'),
        marginBottom: document.getElementById('margin-bottom'),
        marginLeft: document.getElementById('margin-left'),
        marginRight: document.getElementById('margin-right'),
        safeColor: document.getElementById('safe-area-color'),
        unsafeColor: document.getElementById('unsafe-area-color'),
        downloadBtn: document.getElementById('download-btn'),
        themeToggle: document.getElementById('theme-toggle'),
        uiToggle: document.getElementById('ui-toggle'),
        mediaUpload: document.getElementById('media-upload'),
        canvasPreview: document.getElementById('canvas-preview'),
        safeArea: document.getElementById('safe-area'),
        uiOverlay: document.getElementById('ui-overlay'),
        userMediaContainer: document.getElementById('user-media-container'),
        dimensionsLabel: document.getElementById('canvas-dimensions-label'),
    };

    // Preajustes con datos de la interfaz de usuario
    const presets = {
        'ig-reels': { w: 1080, h: 1920, t: 220, b: 420, l: 0, r: 0, ui: 'assets/reels-ui.png' },
        'tiktok': { w: 1080, h: 1920, t: 108, b: 320, l: 60, r: 0, ui: 'assets/tiktok-ui.png' },
        'yt-shorts': { w: 1080, h: 1920, t: 140, b: 270, l: 0, r: 0, ui: 'assets/shorts-ui.png' },
        'ig-post-1x1': { w: 1080, h: 1080, t: 60, b: 60, l: 60, r: 60, ui: '' },
        'ig-post-4x5': { w: 1080, h: 1350, t: 90, b: 90, l: 0, r: 0, ui: '' },
        'custom': { w: 1080, h: 1920, t: 100, b: 100, l: 50, r: 50, ui: '' },
    };

    // Función principal para actualizar la vista previa
    function updatePreview() {
        const state = {
            width: parseInt(elements.canvasWidth.value) || 1080,
            height: parseInt(elements.canvasHeight.value) || 1920,
            top: parseInt(elements.marginTop.value) || 0,
            bottom: parseInt(elements.marginBottom.value) || 0,
            left: parseInt(elements.marginLeft.value) || 0,
            right: parseInt(elements.marginRight.value) || 0,
            safeBg: elements.safeColor.value,
            unsafeBg: elements.unsafeColor.value,
            uiVisible: elements.uiToggle.checked,
            uiSrc: presets[elements.preset.value]?.ui || ''
        };

        // Escalar el lienzo para que quepa en la pantalla
        const scale = Math.min(1, (window.innerHeight - 100) / state.height, (window.innerWidth - 600) / state.width);
        elements.canvasPreview.style.width = `${state.width * scale}px`;
        elements.canvasPreview.style.height = `${state.height * scale}px`;

        // Aplicar estilos
        elements.canvasPreview.style.backgroundColor = state.unsafeBg;
        elements.safeArea.style.backgroundColor = state.safeBg;
        
        // El truco para los márgenes es usar 'clip-path' en el área segura
        elements.safeArea.style.clipPath = `inset(${state.top}px ${state.right}px ${state.bottom}px ${state.left}px)`;

        // Actualizar etiqueta de dimensiones
        elements.dimensionsLabel.textContent = `${state.width}x${state.height}`;

        // Gestionar la capa de la interfaz
        elements.uiOverlay.src = state.uiSrc;
        elements.uiOverlay.style.display = state.uiVisible && state.uiSrc ? 'block' : 'none';
    }

    // Cargar preajuste seleccionado
    function handlePresetChange() {
        const selectedPreset = presets[elements.preset.value];
        if (selectedPreset) {
            elements.canvasWidth.value = selectedPreset.w;
            elements.canvasHeight.value = selectedPreset.h;
            elements.marginTop.value = selectedPreset.t;
            elements.marginBottom.value = selectedPreset.b;
            elements.marginLeft.value = selectedPreset.l;
            elements.marginRight.value = selectedPreset.r;
            elements.uiToggle.checked = !!selectedPreset.ui;
            updatePreview();
        }
    }

    // Cargar imagen/video del usuario
    function handleMediaUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        elements.userMediaContainer.innerHTML = ''; // Limpiar contenedor
        
        let mediaElement;
        if (file.type.startsWith('video/')) {
            mediaElement = document.createElement('video');
            mediaElement.autoplay = true;
            mediaElement.muted = true;
            mediaElement.loop = true;
        } else {
            mediaElement = document.createElement('img');
        }
        mediaElement.src = url;
        elements.userMediaContainer.appendChild(mediaElement);
    }
    
    // Cambiar tema (oscuro/claro)
    function handleThemeToggle() {
        document.body.classList.toggle('dark-mode');
    }

    // Descargar PNG
    function downloadPNG() {
        const node = elements.canvasPreview;
        html2canvas(node, {
             useCORS: true, // Para imágenes de otras fuentes
             allowTaint: true,
             backgroundColor: null // Hacer fondo transparente si es necesario
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `SafeZone_Template_${elements.canvasWidth.value}x${elements.canvasHeight.value}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }

    // Añadir todos los event listeners
    Object.values(elements).forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
            el.addEventListener('input', updatePreview);
        }
    });
    elements.preset.addEventListener('change', handlePresetChange);
    elements.themeToggle.addEventListener('change', handleThemeToggle);
    elements.mediaUpload.addEventListener('change', handleMediaUpload);
    elements.downloadBtn.addEventListener('click', downloadPNG);

    // Carga inicial
    handlePresetChange();
});
