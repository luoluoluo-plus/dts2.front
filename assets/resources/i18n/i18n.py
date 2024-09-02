# -*- coding: utf-8 -*-
import os
import re
import sys
reload(sys)
sys.setdefaultencoding('utf8')

def check_has_contain(check_str):
    # for ch in check_str.decode('utf-8'):
    #     if u'\u4e00' <= ch <= u'\u9fff':
    #         return True
    # return False

    if "i18n_" in check_str :
        return False
    return True

def writeToJson(data):
    with open('./label/en.json','a+') as en:
        en.writelines(data)
        en.close()

    with open('./label/zh.json','a+') as zh:
        zh.writelines(data)
        zh.close()
        
def searchI18n(path, wenjianname, version):
    # 打开文件
    file_data = ""
    num = 1
    with open(path, "r") as f:
            
            for line in f:
                _line = line.strip()
                
                matchObj = re.match( r'"i18n_string": "(.*?)",', _line, re.I)
                
                if matchObj:
                    if matchObj.group(1):
                        if check_has_contain(matchObj.group(1)):
                            print "path:", path, matchObj.group(1)

                            tname = "i18n_" + wenjianname + "_" + version + "_" + str(num)

                            writeToJson(line.replace("i18n_string", tname))
                            
                            line = line.replace(matchObj.group(1), tname)
                            num += 1
                    
                file_data += line

    #重写原文件
    with open(path,"w") as f:
        f.write(file_data)

#删除最后一行
def deletLastRow(file):
    readFile = open(file)
    lines = readFile.readlines()
    readFile.close()
    w = open(file,'w')
    w.writelines([item for item in lines[:-1]])
    w.close()

def walkFile(file, version):
    deletLastRow('./label/en.json')
    deletLastRow('./label/zh.json')
    # with open('./label/en.json','w') as en:
    #     en.write("{")
    #     en.write("\n")
    #     en.close()

    # with open('./label/zh.json','w') as zh:
    #     zh.write("{")
    #     zh.write("\n")
    #     zh.close()

    for root, dirs, files in os.walk(file):
        # root 表示当前正在访问的文件夹路径
        # dirs 表示该文件夹下的子目录名list
        # files 表示该文件夹下的文件list

        # 遍历文件
        for f in files:
            path = os.path.join(root, f)
            if not "temp" in path:
                if ".prefab" in path:
                    if not ".prefab.meta" in path:
                        searchI18n(os.path.join(root, f), f.split('.')[0], version)

                if ".fire" in path:
                    if not ".fire.meta" in path:
                        print path
                        searchI18n(os.path.join(root, f), f.split('.')[0], version)

        # 遍历所有的文件夹
        # for d in dirs:
        #     print(os.path.join(root, d))

    with open('./label/en.json','a+') as en:
        en.write("}")
        en.close()

    with open('./label/zh.json','a+') as zh:
        zh.write("}")
        zh.close()

    print "i18n翻译完成,请手动删除en.json跟zh.json的最后一个<,>"


def main():
    version = raw_input("请输入版本号:")
    with open(version + ".text" ,'w') as f:
        f.writelines("版本：" + version)
        f.close()

    walkFile("../../..", version)

if __name__ == '__main__':
    main()


