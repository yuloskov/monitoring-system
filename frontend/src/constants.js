export const 
    OPTION_BUFF = 'buff',
    OPTION_QUALITY = 'quality',
    QUALITY_PERFECT = '#00FF00',
    QUALITY_MEDIUM = '#FFFF00',
    QUALITY_BAD = '#FF0000',
    BUFF_GOOD = '#00FF00',
    BUFF_BAD = '#FF0000',
    QUALITY_COLOR = {
        1080: QUALITY_PERFECT,
        720: QUALITY_MEDIUM,
    },
    YmapsModules = ['templateLayoutFactory', 'template.filtersStorage', 'Placemark', 'Clusterer', 'control.ZoomControl', 'layout.PieChart', 'util.augment', 'collection.Item'],
    //Change for https://api.startmetrics.sgmakarov.ru
    host = 'https://api.startmetrics.sgmakarov.ru',
    tickformatstops = [{
          'dtickrange': [null, 1000],
          'value': '%H:%M:%S.%L ms'
        },
          {
            'dtickrange': [10000, 60000],
            'value': '%H:%M:%S s'
          },
          {
            'dtickrange': [60000, 86400000],
            'value': '%H:%M h'
          },
          {
            'dtickrange': [86400000, 604800000],
            'value': '%e. %b d'
          },
          {
            'dtickrange': [604800000, 'M1'],
            'value': '%e. %b w'
          },
          {
            'dtickrange': ['M1', 'M12'],
            'value': '%b \'%y M'
          },
          {
            'dtickrange': ['M12', null],
            'value': '%Y Y'
          }
        ],
    graphcolor = '#b0091e',
    bgcolor = '#1d1f23',
    lightgray = 'rgb(204,204,204)',
    gridcolor = 'rgb(104,104,104)',
    primary = '#1d1f23',
    bglightcolor = '#313134'
