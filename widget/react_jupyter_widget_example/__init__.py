from ._version import version_info, __version__

from .react_jupyter_widget import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'diet-parselantro-widget',
        'require': 'diet-parselantro-widget/extension'
    }]
