# 执行脚本

# 文件目录
# 忽略以下文件的变化
git update-index --assume-unchanged main/.env.development
git update-index --assume-unchanged main/public/config/base.config.json

# 若需要修改提交这里的一些文件，请手动执行以下命令
# git update-index --no-assume-unchanged [文件路径]
