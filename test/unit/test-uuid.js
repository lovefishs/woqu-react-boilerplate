import { describe, it } from 'mocha'
import { expect } from 'chai'

import uuid from '../../src/utils/uuid'

describe('单元测试 - uuid 函数', () => {
  const id = uuid()
  const id2 = uuid()

  it('返回值类型为 string', () => {
    expect(id).to.be.a('string')
  })

  it('返回值长度大于 20', () => {
    expect(id).to.have.length.above(20)
  })

  it('返回值长度小于 40', () => {
    expect(id).to.have.length.below(40)
  })

  it('返回值长度等于 36', () => {
    expect(id).to.have.lengthOf(36)
  })

  it('返回值唯一 id !== id2', () => {
    expect(id).to.not.equal(id2)
  })
})
