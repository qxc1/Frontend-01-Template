const  css  =  require （'css' ）
const  EOF  =  符号（“ EOF” ）
让 currentToken  = null ;
让 curentAttribute  = null ;

让 栈 =  [ {
  类型：“文档” ，
  儿童：[ ]
} ]
让 currentTextNode  = null ;

让 规则 =  [ ] ;

函数 addCSSRules （文本） {
  var  ast  =  css 。解析（文本）
  规则。推送（ ... ast 。样式表。规则）
}

功能 匹配（元素， 选择器） {
  if  （！选择器 ||！元素。属性） {
    返回 假
  }

  如果 （选择器。的charAt （0 ） ==  “＃” ） {
    var  attr  =  元素。属性。过滤器（ATTR  =>  ATTR 。名 ===  'ID' ）[ 0 ]
    如果 （ATTR  &&  ATTR 。值 ===  选择。替换（“＃” ， “”  ）） { 
      返回 真
    }
  }  否则 如果 （选择器。的charAt （0 ） ==  “” ） {
    var  attr  =  元素。属性。过滤器（ATTR  =>  ATTR 。名 ===  '类' ）[ 0 ]
    如果 （ATTR  &&  ATTR 。值 ===  选择。替换（“” ，“”  ）） { 
      返回 真
    }
  }  其他 {
    如果 （元件。的tagName  ===  选择器） {
      返回 真
    }
  }
}

功能 特异性（选择器） {
  VAR  p  =  [ 0 ， 0 ， 0 ， 0 ]
  var  selectorParts  =  选择器。分割（'' ）;
  为 （VAR  部分 的 selectorParts ） {
    如果 （部分。的charAt （0 ） ===  “＃” ） {
      p [ 1 ]  + =  1
    }  否则 如果 （部分。的charAt （0 ） ===  “” ） {
      p [ 2 ]  + =  1
    }  其他 {
      p [ 3 ]  + =  1
    }
  }
  返回 p
}

函数 比较（sp1 ， sp2 ） {
  如果 （SP1 [ 0 ]  -  SP2 [ 0 ] ） {
    返回 SP1 [ 0 ]  -  SP2 [ 0 ]
  }
  如果 （SP1 [ 1 ]  -  SP2 [ 1 ] ） {
    返回 SP1 [ 1 ]  -  SP2 [ 1 ]
  }
  如果 （SP1 [ 2 ]  -  SP2 [ 2 ] ） {
    返回 SP1 [ 2 ]  -  SP2 [ 2 ]
  }
  返回 SP1 [ 3 ]  -  SP2 [ 3 ]
}

函数 computeCSS （element ） {
  var  element  =  stack 。切片（）。倒转（）
  如果 （！元素。computedStyle ） {
    元素。计算样式 =  { }
  }

  对于 （让 规则 的 规则） {
    var  selectorParts  =  rule 。选择器[ 0 ] 。分割（“” ）。倒转（）
    如果 （！match （element ， selectorParts [ 0 ] ）） {
      继续
    }

    var  j  =  1 ;
    为 （VAR  我 =  0 ;  我 <  元素。长度;  我++ ） {
      if  （match （元素[ i ] ， selectorParts [ j ] ）） {
        Ĵ ++
      }
    }
    如果 （Ĵ > = selectorParts 。长度） {
      匹配 =  真
    }

    如果 （匹配） {
      VAR  SP  =  特异性（规则。选择[ 0 ] ）;
      var  computeStyle  =  element 。计算样式;
      对于 （VAR  声明 的 规则。声明） {
        如果 （！calculatedStyle [ 声明。属性] ） {
          计算样式[ 声明。属性]  =  { }
        }
        如果 （！computedStyle [ 声明。属性] 。特异性） {
          计算样式[ 声明。财产] 。值 =  声明。值
          计算样式[ 声明。财产] 。特异性 =  sp
        }  否则 如果 （比较（computedStyle [ 声明。属性] 。特异性， SP ） <  0 ） {
          计算样式[ 声明。财产] 。值 =  声明。值
          计算样式[ 声明。财产] 。特异性 =  sp
        }
      }
    }
  }
}

函数 emit （令牌） {
  let  top  =  stack [ 堆栈。长度 -  1 ] ;
  如果 （令牌。类型 ===  'STARTTAG' ） {
    让 element  =  {
      类型：“元素” ，
      孩子：[ ] ，
      属性：[ ]
    }
    元素。tagName  =  令牌。标签名

    为 （让 p  为 令牌） {
      if  （p！= “ type”  ||  p！= 'tagName' ） {
        元素。属性。推（{
          名称：p ，
          值：令牌[ p ]
        } ）
      }
    }

    computeCSS （element ） //在这里计算CSS

    顶部。孩子们。推（element ）

    如果 （！令牌。isSelfClosing ） {
      堆栈。推（element ）
    }
    currentTextNode  = null ;
  }  否则 如果 （令牌。键入 ===  'ENDTAG' ） {
    如果 （顶。标签名！= 令牌。标签名） {
      引发 新 错误（“标记开始结束不匹配！” ）
    }  其他 {
      堆栈。弹出（）
    }
    currentTextNode  = null
  }  否则 如果 （令牌。类型 ===  “文本” ） {
    如果 （currentTextNode  == null ） {
      currentTextNode  =  {
        类型：“文本” ，
        内容：“”
      }

      顶部。孩子们。推送（currentTextNode ）
    }
    currentTextNode 。内容 + =  令牌。内容
  }
}

功能 数据（c ） {
  如果 （c  ===  “ <” ） {
    返回 标签打开
  }  否则， 如果 （c  =  EOF ） {
    发出（{
      类型：“ EOF”
    } ）
    返回
  }  其他 {
    发出（{
      类型：“文本” ，
      含量：c
    } ）
    返回 数据
  }
}

函数 tagOpen （c ） {
  如果 （c  ===  '/' ） {
    返回 endTagOpen
  }  否则 如果 （Ç 。匹配（/ ^ [ A-ZA-Z ] $ / ）） {
    currentToken  =  {
      类型：“ startTag” ，
      tagName：“”
    }
    返回 tagName （c ）
  }  其他 {
    发出（{
      类型：“文本” ，
      含量：c
    } ）;
    回报;
  }
}

函数 tagName （c ） {
  如果 （Ç 。匹配（/ ^ [ \吨\ n \˚F  ] $ / ）） {
    返回 beforeAttributeName ;
  }  else  if  （c  ===  '/' ） {
    返回 SelfClosingStartTag
  }  否则 如果 （Ç 。匹配（/ ^ [ AZ ] $ / ）） {
    currentToken 。tagName  + =  c
    返回 tagName
  }  else  if  （c  ==  '>' ） {
    发出（currentToken ）
    返回 数据
  }  其他 {
    currentToken 。tagName  + =  c ;
    返回 tagName
  }
}

函数 beforeAttributeName （c ） {
  如果 （Ç 。匹配（/ ^ [ \吨\ n \˚F  ] $ / ）） {
    返回 beforeAttributeName
  }  else  if  （c  ==  '/'  ||  c  ==  “>”  ||  c  ==  EOF ） {
    返回 afterAttributeName （c ）
  }  else  if  （c  ==  “ =” ） {
    // 去做

  }  其他 {
    currentAttribute  =  {
      名称：“” ，
      价值：''
    }
    返回 attributeName （c ）
  }
}

函数 attributeName （c ） {
  如果 （Ç 。匹配（/ ^ [ \吨\ n \˚F  ] $ / ） ||  ç  ==  '/'  ||  ç  ==  '>'  ||  Ç  ==  EOF ） {
    返回 afterAttributeName （c ）
  }  否则， 如果 （c  ==  '=' ） {
    返回 beforeAttributeValue
  }  else  if  （c  ===  “ \ u0000” ） {
    // 去做

  }  else  if  （c  ==  “ \”“  ||  c  ==  ”'“  ||  c  ==  ” <“ ） {
    // 去做
  }  其他 {
    currentAttribute 。名称 + =  c ;
    返回 attributeName
  }
}

函数 beforeAttributeValue （c ） {
  如果 （Ç 。匹配（/ ^ [ \吨\ n \˚F  ] $ / ） ||  ç  ==  '/'  ||  ç  ==  '>'  ||  Ç  ==  EOF ） {
    返回 beforeAttributeValue
  }  else  if  （c  ==  “ \”“ ） {
    返回 doubleQuotedAttributeValue ;
  }  else  if  （c  ==  “ \'” ） {
    返回 singleQuotedAttributeValue
  }  else  if  （c  ==  '>' ） {
    // 去做
  }  其他 {
    返回 UnquotedAttributeValue （c ）
  }
}

函数 doubleQuotedAttributeValue （c ） {
  如果 （c  ==  “ \”“ ） {
    currentToken [ currentAttribute 。名称]  =  currentAttribute 。价值;
    返回 afterQuotedAttributeValue
  }  else  if  （c  ==  “ \ u0000” ） {
    // 去做
  }  否则， 如果 （c  ==  EOF ） {

  }  其他 {
    currentAttribute 。值 + =  c ;
    返回 doubleQuotedAttributeValue
  }
}

函数 singleQuotedAttributeValue （c ） {
  如果 （c  ==  “ \'” ） {
    currentToken [ currentAttribute 。名称]  =  currentAttribute 。价值;
    返回 afterQuotedAttributeValue
  }  else  if  （c  ==  “ \ u0000” ） {
    // 去做
  }  否则， 如果 （c  ==  EOF ） {

  }  其他 {
    currentAttribute 。值 + =  c ;
    返回 doubleQuotedAttributeValue
  }
}

函数 afterQuotedAttributeValue （c ） {
  如果 （Ç 。匹配（/ ^ [ \吨\ n \˚F  ] $ / ）） {
    返回 beforeAttributeName
  }  else  if  （c  ==  “ /” ） {
    返回 SelfClosingStartTag
  }  else  if  （c  ==  “>” ） {
    currentToken [ currentAttribute 。名称]  =  currentAttribute 。值
    发出（currentToken ）
    返回 数据
  }  否则， 如果 （c  ==  EOF ） {
    //去做
  }  其他 {
    currentAttribute 。值 + =  c
    返回 doubleQuotedAttributeValue
  }
}


函数 UnquotedAttributeValue （c ） {
  如果 （Ç 。匹配（/ ^ [ \吨\ n \˚F  ] $ / ）） {
    currentToken [ currentAttribute 。名称]  =  currentAttribute 。值
    返回 beforeAttributeName
  }  else  if  （c  ==  “ /” ） {
    currentToken [ currentAttribute 。名称]  =  currentAttribute 。值
    返回 SelfClosingStartTag
  }  else  if  （c  ==  “>” ） {
    currentToken [ currentAttribute 。名称]  =  currentAttribute 。值
    发出（currentToken ）
    返回 数据
  }  else  if  （c  ==  “ \ u0000” ） {
    // 去做
  }  否则 if  （c  ==  “ \”“  ||  c  ==  ”'“  ||  c  ==  ” <“  ||  c  ==  ” =“  ||  c  ==  ”`“ ） {
    // 去做
  }  否则， 如果 （c  ==  EOF ） {
    //去做
  }  其他 {
    currentAttribute 。值 + =  c
    返回 UnquotedAttributeValue
  }
}


函数 SelfClosingStartTag （c ） {
  如果 （c  ==  “>” ） {
    currentToken 。isSelfClosing  =  true ;
    发出（currentToken ）
    返回 数据
  }  else  if  （c  ==  “ EOF” ） {
    //去做
  }  其他 {
    // 去做
  }
}


函数 endTagOpen （c ） {
  如果 （Ç 。匹配（/ ^ [ A-ZA-Z ] $ / ）） {
    currentToken  =  {
      类型：“ endTag” ，
      tagName：“”
    }
    返回 tagName （c ）
  }  else  if  （c  ==  “>” ） {
    // 去做
  }  否则， 如果 （c  ==  EOF ） {
    //去做
  }  其他 {

  }
}


函数 afterAttributeName （c ） {
  如果 （Ç 。匹配（/ ^ [ \吨\ n \˚F  ] $ / ）） {
    返回 afterAttributeName
  }  else  if  （c  ==  '/' ） {
    返回 SelfClosingStartTag
  }  否则， 如果 （c  ==  '=' ） {
    返回 beforeAttributeValue
  }  else  if  （c  ===  “>” ） {
    // 去做
    currentToken [ currentAttribute 。名称]  =  currentAttribute 。值
    发出（currentToken ）
    返回 数据
  }  否则， 如果 （c  ==  EOF ） {
    // 去做
  }  其他 {
    currentToken [ currentAttribute 。名称]  =  currentAttribute 。值
    currentAttribute  =  {
      名称：“” ，
      值：“”
    }
    返回 attributeName （c ）
  }
}

模块。出口。parseHTML  =  函数 parseHTML （html ） {
  令 状态 =  数据
  为 （让 c  为 html ） {
    状态 =  状态（c ）
  }
  状态 =  状态（EOF ）
  返回 堆栈[ 0 ]
}