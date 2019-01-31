# j-2-j ( JSONs to JSON )

## Installation

```bash
$ npm i -D @cilly/j-2-j
```

## Setting File

./.j-2-j/.setting.json
```
{
  "outputPath": "assets",
  "separators": {
    "comment": {
      "prefix": "/*", // <-- default 
      "suffix": "*/" // <-- default 
    },
    "i18n": { // when your generate type i18n
      "prefix": "::", // <-- default 
      "suffix": "::" // <-- default 
    }
  },
  "dirs": {
    "i18n": {
      "type": "i18n" // <-- default is simple ( i18n, simple, filename )
    },
    "output": {
      "outputPath": "hogehoge", // <-- individual setting of output path,
      "locked": true // <-- skip generate flag
    }
  },
  "files": [ // if you manage only one file, this setting might be helpful.
    {
      "file": "./i18n.json", // <-- this means ./j-2-j/i18n
      "outputPath": "assets/hogehoge" ,
      "locked": true
    }
  ]
}
```

```json
{
  "scripts": {
    "watch": "j-2-j w",
    "generate": "j-2-j g",
    "set-up": "j-2-j up -i ./assets/i18n -o ./.j-2-j/assets -c"
  }
}
```
watch & generate
```
- -a --all : generate all ./.j-2-j/{dirs}
- -t --trim : trim generated json files. 

```

set-up
```
- -i --input : original dir to integrate
- -o --output : target dir to generate
- -c --comment-keep : (optional) generate json without comments. default false
- -d --depth : if depth > 0 -c does not work.
- -t --type : i18n , filename
```

## Purpose

The purpose which is most is managing i18n json files.

ex )
you have i18n files in ./src/assets/i18n

```
src
├── assets
│   └── i18n
│       ├── en.json
│       └── ja.json
```

assets/i18n/en.json
```json

{
  "common": {
    "page_name": {
      "top": "TOP",
      "hello": "Hello {{username}}!"
    }
  },
  "hogehogehoge": "hogehogehoge",
  "page_settings": {
    "header": {
      "title": "Setting Page",
      "sub_title": "Sub Title"
    }
  },
  "page_2": {
    "warning": {
      "updated": "Updated"
    }
  }
}

```

assets/i18n/ja.json
```json

{
  "common": {
    "page_name": {
      "top": "トップ",
      "hello": "{{username}}さん、こんにちは！"
    }
  },
  "hogehogehoge": "ほげほげほげ",
  "page_settings": {
    "header": {
      "title": "設定ページ",
      "sub_title": "サブタイトル"
    }
  },
  "page_2": {
    "warning": {
      "updated": "データが更新されました"
    }
  }
}

```

### You can choose 2 type.

↓

#### type: i18n

Good
- Each file is going to have few lines. 
- You can see all lang about each key.

Bad
- You have to write lang prefix, lang and suffix each new key. ( ex: ::en:: )  

```
.j-2-j
└── i18n
    ├── common.json
    ├── hogehogehoge.json
    ├── page_1
    │   └── error.json
    ├── page_2
    │   └── warning.json
    └── page_settings.json
```

.j-2-j/i18n/common.json
```json
{
  "page_name": {
    "top": {
      "::en::": "トップ",
      "::ja::": "TOP"
    },
    "hello": {
      "::en::": "{{username}}さん、こんにちは！",
      "::ja::": "Hello {{username}}!"
    }
  }
}
```


#### type: filename

Good
- Each file is going to have few lines. 

```
.j-2-j
└── i18n
    ├── commom
    │   ├── en.json
    │   └── ja.json
    ├── en.json
    ├── ja.json
    ├── page_2
    │   └── waring
    │       ├── en.json
    │       └── ja.json
    └── page_settings
        ├── en.json
        └── ja.json
```

.j-2-j/i18n/en.json

```json
{
  "page_name": {
    "dialog": "dialog",
    "hello": "hello {{username}}！"
  }
}
```

---

## set-up target assets file

*only if you use type: i18n or filename (not type: simple) to generate*

assets/i18n/en.json
```json

{
  "common": {
    "page_name": {
      "top": "TOP",
      "hello": "Hello {{username}}!"
    }
  },
  "hogehogehoge": "hogehogehoge",
  "page_settings": {
    "header": {
      "title": "Setting Page",
      "sub_title": "Sub Title"
    }
  },
  "page_2": {
    "warning": {
      "updated": "Updated"
    }
  }
}

```

assets/i18n/ja.json
```json

{
  "common": {
    "page_name": {
      "top": "トップ",
      "hello": "{{username}}さん、こんにちは！"
    }
  },
  "hogehogehoge": "ほげほげほげ",
  "page_settings": {
    "header": {
      "title": "設定ページ",
      "sub_title": "サブタイトル"
    }
  },
  "page_2": {
    "warning": {
      "updated": "データが更新されました"
    }
  }
}

```

`npm run set-up`

.j-2-j/assets/i18n.json
```json
{
  "common": {
    "page_name": {
      "top": {
        "::en::": "トップ",
        "::ja::": "TOP"
      },
      "hello": {
        "::en::": "{{username}}さん、こんにちは！",
        "::ja::": "Hello {{username}}!"
      }
    }
  },
  "hogehogehoge": {
    "::en::": "hogehogehoge",
    "::ja::": "ほげほげほげ"
  },
  "page_settings": {
    "header": {
      "title": {
        "::en::": "Setting Page",
        "::ja::": "設定ページ"
      },
      "sub_title": {
        "::en::": "Sub Title",
        "::ja::": "サブタイトル"
      }
    }
  },
  "page_2": {
    "warning": {
      "updated": {
        "::en::": "Updated",
        "::ja::": "データが更新されました"
      }
    }
  }
}
```


## Generate i18n files

run `npm run watch` or `npm run generate`
( watch command 'watch .j-2-j/{dirs}' and generate when these json file are changed )

### Type: i18n

i18n.json
```json
{
  "common": {
    "page_name": {
      "top": {
        "::en::": "トップ",
        "::ja::": "TOP"
      },
      "hello": {
        "::en::": "{{username}}さん、こんにちは！",
        "::ja::": "Hello {{username}}!"
      }
    }
  },
  "hogehogehoge": {
    "::en::": "hogehogehoge",
    "::ja::": "ほげほげほげ"
  },
  "page_settings": {
    "header": {
      "title": {
        "::en::": "Setting Page",
        "::ja::": "設定ページ"
      },
      "sub_title": {
        "::en::": "Sub Title",
        "::ja::": "サブタイトル"
      }
    }
  },
  "page_2": {
    "warning": {
      "updated": {
        "::en::": "Updated",
        "::ja::": "データが更新されました"
      }
    }
  }
}
```

en.json
```json
{
  "i18n": {
    "common": {
      "page_name": {
        "top": "TOP",
        "hello": "Hello {{username}}!"
      }
    },
    "hogehogehoge": "hogehogehoge",
    "page_settings": {
      "header": {
        "title": "Setting Page",
        "sub_title": "Sub Title"
      }
    },
    "page_2": {
      "warning": {
        "updated": "Updated"
      }
    }
  }
}
```

ja.json
```json
{
  "i18n": {
    "common": {
      "page_name": {
        "top": "トップ",
        "hello": "{{username}}さん、こんにちは！"
      }
    },
    "hogehogehoge": "ほげほげほげ",
    "page_settings": {
      "header": {
        "title": "設定ページ",
        "sub_title": "サブタイトル"
      }
    },
    "page_2": {
      "warning": {
        "updated": "データが更新されました"
      }
    }
  }
}
```

## Issue
- Unit Test
- TODO